const { GoogleGenerativeAI } = require('@google/generative-ai');
const prompts = require('./prompt.templates.js');

const API_KEY = process.env.GEMINI_API_KEY;
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
const FALLBACK_MODELS = (process.env.GEMINI_FALLBACK_MODELS || 'gemini-2.5-flash')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
const genAI = new GoogleGenerativeAI(API_KEY);
const MAX_RETRIES = Number(process.env.GEMINI_MAX_RETRIES || 3);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function parseRetryDelayMs(err) {
    const msg = String(err?.message || '');
    const secMatch = msg.match(/retry in\s+([\d.]+)s/i);
    if (secMatch) return Math.ceil(Number(secMatch[1]) * 1000);
    return 30000;
}

function buildFullCoursePrompt(topic, difficulty) {
    return `
Generate a complete course as valid JSON only (no markdown fences).
Topic: "${topic}"
Difficulty: "${difficulty}"
Duration: "4-6 weeks"

Return this exact JSON shape:
{
  "title": "string",
  "description": "string",
  "learning_objectives": ["string"],
  "modules": [
    {
      "id": "module-1",
      "title": "string",
      "description": "string",
      "lessons": [
        {
          "id": "lesson-1",
          "title": "string",
          "objective": "string",
          "duration": "string",
          "content": {
            "explanation": "markdown explanation with headings and bullets",
            "key_concepts": ["string"],
            "examples": ["string"]
          },
          "videoScript": "short narration script for explainer video"
        }
      ]
    }
  ]
}

Rules:
- 3-4 modules, each 3-4 lessons.
- Keep lesson content educational and practical for the requested difficulty.
- "content.explanation" must be detailed markdown with headings and bullet points.
- Ensure all IDs are unique and stable-like (module-1, lesson-1, etc.).
`.trim();
}

/**
 * Robust JSON generation using the official SDK.
 */
async function generateJson(modelName, prompt) {
    if (!API_KEY) throw new Error('GEMINI_API_KEY not configured');

    const modelCandidates = [modelName || DEFAULT_MODEL, ...FALLBACK_MODELS]
        .filter((m, i, arr) => m && arr.indexOf(m) === i);

    let lastErr;
    for (const selectedModel of modelCandidates) {
        const model = genAI.getGenerativeModel({
            model: selectedModel,
            generationConfig: { responseMimeType: 'application/json' }
        });

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            // Cleanup markdown code blocks
            text = text.replace(/^```json\s*/g, '').replace(/\s*```$/g, '').trim();
            
            try {
                return JSON.parse(text);
            } catch (parseErr) {
                // Best-effort sanitization: escape unescaped backslashes (often from LaTeX/Markdown)
                // This targets single backslashes not followed by valid JSON escape sequences
                let sanitized = text.replace(/\\(?!["\\/bfnrt])/g, '\\\\');
                // Also remove any control characters that break JSON
                sanitized = sanitized.replace(/[\u0000-\u001F]+/g, ' ');
                try {
                    return JSON.parse(sanitized);
                } catch (sanitizedErr) {
                    throw parseErr;
                }
            }
        } catch (err) {
            const status = err?.status;
            const retriable = status === 429 || status === 503;
            if (!retriable || attempt === MAX_RETRIES) {
                lastErr = err;
                if (status === 404 || status === 429) {
                    console.warn(`[Gemini SDK] ${selectedModel} unavailable/rate-limited. Trying fallback...`);
                    break;
                }
                console.error(`[Gemini SDK] Error for ${selectedModel}:`, err.message);
                throw err;
            }

            const waitMs = parseRetryDelayMs(err) + (attempt * 1000);
            console.warn(`[Gemini SDK] Rate limited (${status}). Retrying in ${Math.ceil(waitMs / 1000)}s...`);
            await sleep(waitMs);
        }
        }
    }

    throw lastErr || new Error('Gemini generation failed on all configured models');
}

async function generateCourseOutline(topic, difficulty = 'Beginner') {
    const prompt = prompts.courseOutline
        .replace('{{TOPIC}}', topic)
        .replace('{{DIFFICULTY}}', difficulty)
        .replace('{{DURATION}}', '4-6 weeks');
    return generateJson(DEFAULT_MODEL, prompt);
}

async function generateLessonContent({ topic, lessonTitle, outline }) {
    const prompt = prompts.lessonContent
        .replace('{{COURSE_TOPIC}}', topic)
        .replace('{{LESSON_TITLE}}', lessonTitle)
        .replace('{{LESSON_OBJECTIVE}}', 'Learn ' + lessonTitle)
        .replace('{{outline}}', JSON.stringify(outline));
    return generateJson(DEFAULT_MODEL, prompt);
}

async function generateVideoScript({ topic, lessonTitle, lessonContent }) {
    const prompt = prompts.videoScript
        .replace('{{TOPIC}}', topic)
        .replace('{{LESSON_TITLE}}', lessonTitle || '')
        .replace('{{LESSON_CONTENT}}', JSON.stringify(lessonContent || ''));
    return generateJson(DEFAULT_MODEL, prompt);
}

async function generateQuiz({ lessonTitle, lessonContent }) {
    const prompt = prompts.quiz
        .replace('{{LESSON_TITLE}}', lessonTitle)
        .replace('{{LESSON_CONTENT}}', JSON.stringify(lessonContent));
    return generateJson(DEFAULT_MODEL, prompt);
}

/**
 * Generates everything in parallel for maximum speed.
 */
async function generateFullCourse({ topic, difficulty = 'Beginner' }) {
    console.log(`[Course] Generating full course for: "${topic}" (Difficulty: ${difficulty})...`);
    
    // Instead of one giant prompt, we use the courseOutline to get the structure
    // and then we can enrich it if we want. But for "one-shot" creation,
    // we should at least use a high-quality prompt.
    
    const prompt = `
Generate a comprehensive, professional course as valid JSON.
Topic: "${topic}"
Difficulty: "${difficulty}"

Return this exact JSON structure:
{
  "title": "string",
  "description": "string",
  "learning_objectives": ["string"],
  "modules": [
    {
      "id": "module-1",
      "title": "Module Title",
      "description": "Module description",
      "lessons": [
        {
          "id": "lesson-1-1",
          "title": "Lesson Title",
          "objective": "Lesson learning goal",
          "duration": "Duration (e.g. 15 min)",
          "content": {
            "explanation": "Detailed professional markdown explanation (4-6 paragraphs, use headings, bold text, bullet points)",
            "key_concepts": [
              { "term": "string", "definition": "string" }
            ],
            "examples": ["string"],
            "takeaway": "One sentence core insight",
            "visual_suggestions": ["string"]
          },
          "videoScript": {
            "title": "Video Title",
            "scenes": [
              { "type": "text|diagram_process_threads|graph_derivative|real_world_car_speed", "narration": "Narration text" }
            ]
          }
        }
      ]
    }
  ]
}

Rules:
- 2-3 modules, 2-3 lessons per module.
- CRITICAL: Keep all content EXTREMELY CONCISE and brief to fit within strict model output limits (max 65k tokens).
- CRITICAL JSON Escaping: All JSON strings MUST be strictly valid. Double-escape backslashes (e.g. \\textbf or \\\\n) and avoid unescaped quotes or newlines inside strings.
- "content.explanation" MUST be rich markdown content but limit to 2-3 short paragraphs max.
- "videoScript.scenes" must have exactly 3 short scenes.
- Use only the allowed scene types.
- Ensure all IDs are unique and JSON is valid.
`.trim();

    const fullCourse = await generateJson(DEFAULT_MODEL, prompt);

    return {
        id: 'course-' + Date.now(),
        topic,
        difficulty,
        createdAt: new Date().toISOString(),
        ...fullCourse
    };
}

/**
 * Generates a full Manim Python script for an explainer video.
 */
async function generateManimScript(topic, explanation = '') {
    const prompt = prompts.manimScript(topic, explanation);
    
    // We use a regular text model here because we want raw Python, not JSON
    if (!API_KEY) throw new Error('GEMINI_API_KEY not configured');

    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract code block
    const codeMatch = text.match(/```python\s*([\s\S]*?)```/);
    const script = codeMatch ? codeMatch[1].trim() : text.trim();

    return {
        title: topic,
        script: script
    };
}

module.exports = {
    generateCourseOutline,
    generateLessonContent,
    generateVideoScript,
    generateQuiz,
    generateFullCourse,
    generateManimScript
};
