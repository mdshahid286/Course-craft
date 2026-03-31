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

/**
 * Generates mock course data for development when Gemini API is not available
 */
function generateMockData(prompt) {
    console.log('[Gemini] Generating mock course data...');
    
    // Extract topic from prompt if possible
    const topicMatch = prompt.match(/Topic:\s*"([^"]+)"/);
    const topic = topicMatch ? topicMatch[1] : 'Web Development';
    
    // Extract difficulty from prompt if possible
    const difficultyMatch = prompt.match(/Difficulty:\s*"([^"]+)"/);
    const difficulty = difficultyMatch ? difficultyMatch[1] : 'Beginner';
    
    const mockCourse = {
        title: `Introduction to ${topic}`,
        description: `A comprehensive ${difficulty.toLowerCase()} course covering the fundamentals of ${topic}. Learn the essential concepts, best practices, and practical skills needed to master this subject.`,
        learning_objectives: [
            `Understand the core concepts of ${topic}`,
            `Apply practical skills through hands-on exercises`,
            `Build real-world projects to demonstrate your knowledge`,
            `Develop problem-solving abilities in ${topic}`
        ],
        modules: [
            {
                id: 'module-1',
                title: 'Getting Started',
                description: 'Learn the basics and set up your environment',
                lessons: [
                    {
                        id: 'lesson-1-1',
                        title: 'What is ' + topic + '?',
                        objective: 'Understand what ' + topic + ' is and why it matters',
                        duration: '15 min',
                        content: {
                            explanation: `# Introduction to ${topic}\n\n${topic} is a fundamental concept in modern technology. This lesson covers the basic principles and foundations that every learner should understand.\n\n## Key Concepts\n\n- **Core Principles**: The fundamental building blocks of ${topic}\n- **Applications**: Real-world uses and examples\n- **Best Practices**: Industry standards and guidelines\n\n## Practical Examples\n\nLearn through hands-on examples that demonstrate the practical application of ${topic} in real scenarios.`,
                            key_concepts: [
                                { term: 'Fundamentals', definition: 'The basic principles that form the foundation' },
                                { term: 'Applications', definition: 'Practical uses in real-world scenarios' },
                                { term: 'Best Practices', definition: 'Industry-standard approaches and methods' }
                            ],
                            examples: [
                                'Basic implementation example',
                                'Common use case demonstration',
                                'Industry application scenario'
                            ],
                            takeaway: `${topic} provides essential tools and concepts for modern development.`,
                            visual_suggestions: [
                                'Conceptual diagram showing relationships',
                                'Flowchart of basic processes',
                                'Comparison chart of different approaches'
                            ]
                        },
                        videoScript: {
                            title: `${topic} Fundamentals`,
                            scenes: [
                                { type: 'text', narration: `Welcome to our introduction to ${topic}. In this lesson, we'll explore the fundamental concepts that form the foundation of this important subject.` },
                                { type: 'diagram_process_threads', narration: 'Lets visualize how the different components work together in a typical system architecture.' },
                                { type: 'real_world_car_speed', narration: 'Finally, well see how these concepts apply in real-world scenarios with practical examples.' }
                            ]
                        }
                    },
                    {
                        id: 'lesson-1-2',
                        title: 'Setting Up Your Environment',
                        objective: 'Configure your development environment for ' + topic,
                        duration: '20 min',
                        content: {
                            explanation: `# Environment Setup for ${topic}\n\nSetting up a proper development environment is crucial for success. This lesson guides you through the essential tools and configurations.\n\n## Required Tools\n\n- **Development Environment**: Setting up your workspace\n- **Essential Tools**: Must-have software and utilities\n- **Configuration**: Proper settings for optimal performance\n\n## Step-by-Step Guide\n\nFollow along as we set up everything you need to start working with ${topic} effectively.`,
                            key_concepts: [
                                { term: 'Development Environment', definition: 'The setup of tools and software needed for development' },
                                { term: 'Configuration', definition: 'Settings and parameters for optimal performance' },
                                { term: 'Best Practices', definition: 'Recommended setup procedures' }
                            ],
                            examples: [
                                'Installation walkthrough',
                                'Configuration examples',
                                'Troubleshooting common issues'
                            ],
                            takeaway: 'A properly configured environment sets you up for success.',
                            visual_suggestions: [
                                'Installation flowchart',
                                'Configuration diagram',
                                'Tool comparison table'
                            ]
                        },
                        videoScript: {
                            title: 'Environment Setup',
                            scenes: [
                                { type: 'text', narration: 'Lets set up your development environment step by step, starting with the essential tools youll need.' },
                                { type: 'diagram_process_threads', narration: 'Heres a visual guide showing how all the components connect and work together in your development setup.' },
                                { type: 'real_world_car_speed', narration: 'Well finish with a practical demonstration of the complete setup in action.' }
                            ]
                        }
                    }
                ]
            },
            {
                id: 'module-2',
                title: 'Core Concepts',
                description: 'Master the fundamental concepts and principles',
                lessons: [
                    {
                        id: 'lesson-2-1',
                        title: 'Essential Principles',
                        objective: 'Master the core principles of ' + topic,
                        duration: '25 min',
                        content: {
                            explanation: `# Core Principles of ${topic}\n\nBuilding on the fundamentals, this lesson dives deeper into the essential principles that govern ${topic}. Understanding these concepts is crucial for mastery.\n\n## Advanced Concepts\n\n- **Principle 1**: Detailed explanation of the first core principle\n- **Principle 2**: Understanding the second fundamental concept\n- **Principle 3**: Mastering the third essential element\n\n## Practical Applications\n\nApply these principles through guided exercises and real-world examples that demonstrate their importance and usage.`,
                            key_concepts: [
                                { term: 'Core Principles', definition: 'The fundamental rules and concepts that govern the field' },
                                { term: 'Advanced Concepts', definition: 'More complex ideas built on basic foundations' },
                                { term: 'Applications', definition: 'Practical uses of theoretical concepts' }
                            ],
                            examples: [
                                'Advanced implementation example',
                                'Complex scenario analysis',
                                'Industry-standard solution'
                            ],
                            takeaway: 'Mastering core principles enables you to solve complex problems effectively.',
                            visual_suggestions: [
                                'Advanced concept diagram',
                                'Process flow visualization',
                                'Complex relationship mapping'
                            ]
                        },
                        videoScript: {
                            title: 'Core Principles',
                            scenes: [
                                { type: 'text', narration: 'Now lets explore the core principles that form the foundation of advanced concepts in this field.' },
                                { type: 'graph_derivative', narration: 'Well visualize how these principles relate to each other and build upon fundamental concepts.' },
                                { type: 'real_world_car_speed', narration: 'Finally, well see these principles applied in complex, real-world scenarios.' }
                            ]
                        }
                    },
                    {
                        id: 'lesson-2-2',
                        title: 'Advanced Techniques',
                        objective: 'Learn advanced techniques in ' + topic,
                        duration: '30 min',
                        content: {
                            explanation: `# Advanced Techniques in ${topic}\n\nTake your skills to the next level with advanced techniques used by professionals. This lesson covers sophisticated methods and best practices.\n\n## Professional Methods\n\n- **Technique 1**: Step-by-step guide to the first advanced method\n- **Technique 2**: Mastering the second professional approach\n- **Technique 3**: Implementing the third sophisticated method\n\n## Industry Standards\n\nLearn the techniques that industry professionals use daily to solve complex problems and deliver high-quality solutions.`,
                            key_concepts: [
                                { term: 'Advanced Techniques', definition: 'Sophisticated methods for complex scenarios' },
                                { term: 'Professional Methods', definition: 'Industry-standard approaches and practices' },
                                { term: 'Best Practices', definition: 'Recommended techniques for optimal results' }
                            ],
                            examples: [
                                'Professional implementation',
                                'Complex problem solving',
                                'Industry case study'
                            ],
                            takeaway: 'Advanced techniques enable you to tackle complex challenges like a professional.',
                            visual_suggestions: [
                                'Technique comparison chart',
                                'Advanced process diagram',
                                'Professional workflow visualization'
                            ]
                        },
                        videoScript: {
                            title: 'Advanced Techniques',
                            scenes: [
                                { type: 'text', narration: 'Lets explore advanced techniques that professionals use to solve complex problems efficiently.' },
                                { type: 'graph_derivative', narration: 'Well analyze how these advanced techniques build upon and extend the basic principles we learned earlier.' },
                                { type: 'diagram_process_threads', narration: 'Finally, well visualize the complete workflow showing how all these techniques work together in practice.' }
                            ]
                        }
                    }
                ]
            }
        ]
    };
    
    console.log('[Gemini] Mock course data generated successfully');
    return mockCourse;
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
