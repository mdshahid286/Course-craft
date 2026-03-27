const videoService = require('../services/video.service');

async function generate(req, res) {
  const { topic, async = true, skipOutline = true } = req.body || {};
  if (!topic) {
    return res.status(400).json({ error: 'topic is required' });
  }

  try {
    const result = await videoService.generateFromTopic(topic, {
      skipOutline,
      asyncRender: async !== false, // Default to async
    });

    if (result.jobId) {
      // Async mode: return immediately with job ID
      return res.json({
        topic,
        jobId: result.jobId,
        videoScript: result.videoScript,
        outline: result.outline,
        status: 'rendering',
        message: 'Video is being rendered. Use GET /api/video/status/:jobId to check progress.',
      });
    } else {
      // Sync mode: return with render result
      return res.json({
        topic,
        outline: result.outline,
        videoScript: result.videoScript,
        render: result.render,
      });
    }
  } catch (err) {
    console.error('video generation failed', err);
    return res.status(500).json({ error: 'Video generation failed', detail: err.message });
  }
}

async function getStatus(req, res) {
  const { jobId } = req.params;
  if (!jobId) {
    return res.status(400).json({ error: 'jobId is required' });
  }

  const status = await videoService.getRenderStatus(jobId);
  if (!status) {
    return res.status(404).json({ error: 'Job not found' });
  }

  return res.json({
    jobId,
    ...status,
  });
}

module.exports = { generate, getStatus };

