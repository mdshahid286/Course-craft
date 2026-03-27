const path = require('path');
const fs = require('fs/promises');
const fs_sync = require('fs');
const { spawn } = require('child_process');
const crypto = require('crypto');
const os = require('os');

const gemini = require('../../ai-engine/gemini.service');
const db = require('./db.service');

const videoEngineDir = path.join(__dirname, '..', '..', 'video-engine');

// Queue Configuration
const MAX_CONCURRENT_RENDERS = Number(process.env.MAX_CONCURRENT_RENDERS || 2);
let activeRenders = 0;
const renderQueue = [];

/**
 * Helper to construct the public URL for a video from its absolute path.
 */
function constructVideoUrl(absolutePath) {
  if (!absolutePath) return '';
  
  // Normalize to forward slashes
  const normalizedPath = absolutePath.split(path.sep).join('/');
  
  // Find where "output" starts
  const outputDirSegment = '/output/';
  const outputIndex = normalizedPath.toLowerCase().indexOf(outputDirSegment);
  
  if (outputIndex !== -1) {
    const relativePath = normalizedPath.substring(outputIndex + outputDirSegment.length);
    return `/videos/${relativePath}`;
  }
  
  return '';
}

async function generateFromTopic(topic, options = {}) {
  console.log(`[Video] Requesting Manim script for: "${topic}"`);
  
  // 1. Get detailed script from Gemini
  const { script } = await gemini.generateManimScript(topic, options.explanation || '');
  
  const jobId = options.jobId || `job_${Date.now()}`;
  const scriptPath = path.join(os.tmpdir(), `${jobId}.py`);
  await fs.writeFile(scriptPath, script);

  const jobData = {
    id: jobId,
    topic,
    status: 'queued',
    createdAt: Date.now(),
    scriptPath,
  };

  await db.save('video_jobs', jobId, jobData);
  
  if (options.asyncRender) {
    renderQueue.push({ jobId, scriptPath });
    processQueue();
    return { jobId, videoScript: script };
  }

  return runVideoEngine(scriptPath);
}

async function processQueue() {
  if (activeRenders >= MAX_CONCURRENT_RENDERS || renderQueue.length === 0) {
    return;
  }

  activeRenders++;
  const { jobId, scriptPath } = renderQueue.shift();
  
  try {
    const job = await db.get('video_jobs', jobId);
    if (!job) {
       console.error(`[Video] Job ${jobId} not found in DB, skipping.`);
       throw new Error(`Job ${jobId} not found`);
    }

    await db.save('video_jobs', jobId, { ...job, status: 'rendering', renderStartTime: Date.now() });

    console.log(`[Video] Starting render for job ${jobId}...`);
    const render = await runVideoEngine(scriptPath);
    
    // In raw manim, we look for the output video
    // Manim usually outputs to media/videos/...
    const videoPath = render.engineResult?.video_path || '';
    const videoUrl = constructVideoUrl(videoPath);

    await db.save('video_jobs', jobId, {
      ...job,
      status: 'completed',
      videoPath,
      videoUrl,
      render,
      completedAt: Date.now(),
    });

    await fs.unlink(scriptPath).catch(() => {});
    console.log(`[Video] Successfully completed job ${jobId}`);
  } catch (err) {
    console.error(`[Video] Job ${jobId} failed:`, err.message);
    try {
      const job = await db.get('video_jobs', jobId);
      if (job) {
        await db.save('video_jobs', jobId, {
          ...job,
          status: 'failed',
          error: err.message,
          failedAt: Date.now(),
        });
      }
    } catch (innerErr) {
       console.error(`[Video] Critical DB error during job failure update:`, innerErr.message);
    }
    await fs.unlink(scriptPath).catch(() => {});
  } finally {
    activeRenders--;
    setImmediate(() => processQueue());
  }
}

async function runVideoEngine(scriptPath) {
  const quality = process.env.MANIM_QUALITY || 'ql';
  
  return new Promise((resolve, reject) => {
    const jobId = path.basename(scriptPath, '.py');
    const outputDir = path.join(videoEngineDir, 'output', jobId);
    
    if (!fs_sync.existsSync(outputDir)) {
      fs_sync.mkdirSync(outputDir, { recursive: true });
    }

    // We use manim command directly
    // Using --media_dir to keep it organized
    const proc = spawn('manim', [
      `-p${quality}`, 
      '--media_dir', outputDir,
      scriptPath, 
      'AutoScene'
    ], {
      cwd: videoEngineDir,
      shell: process.platform === 'win32',
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    proc.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

    proc.on('error', (err) => {
      console.error('[Video Engine] Spawn error:', err);
      reject(err);
    });

    proc.on('close', (code) => {
      if (code === 0) {
        // Find the generated mp4 file in outputDir
        // Manim structure: outputDir/videos/<scriptname>/<quality>/AutoScene.mp4
        const videoName = path.basename(scriptPath, '.py');
        const qualityName = quality === 'ql' ? '480p15' : '1080p60'; // simplified mapping
        
        // Let's find any mp4 file in the outputDir recursive
        const findVideo = (dir) => {
          const files = fs_sync.readdirSync(dir);
          for (const f of files) {
            const fullPath = path.join(dir, f);
            if (fs_sync.statSync(fullPath).isDirectory()) {
              const found = findVideo(fullPath);
              if (found) return found;
            } else if (f.endsWith('.mp4')) {
              return fullPath;
            }
          }
          return null;
        };

        const videoPath = findVideo(outputDir);
        resolve({ code, stdout, stderr, engineResult: { video_path: videoPath } });
      } else {
        reject(new Error(`manim exited with code ${code}: ${stderr}`));
      }
    });
  });
}

function getRenderStatus(jobId) {
  return db.get('video_jobs', jobId);
}

module.exports = {
  generateFromTopic,
  getRenderStatus,
};
