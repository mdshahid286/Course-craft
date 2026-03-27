// Prompt templates for Gemini interactions.
module.exports = {
  courseOutline: `You are an expert instructional designer.
Return ONLY valid JSON with this exact shape:
{
  "title": "String",
  "description": "String",
  "learning_objectives": ["String"],
  "modules": [
    {
      "id": "String",
      "title": "String",
      "description": "String",
      "lessons": [
        {
          "id": "String",
          "title": "String",
          "objective": "String",
          "duration": "String"
        }
      ]
    }
  ]
}
Rules:
- Generate 2-3 modules with 2-4 lessons each (6-10 lessons total)
- Each lesson id must be unique (e.g. "lesson-1", "lesson-2")
- Each module id must be unique (e.g. "module-1", "module-2")
- Duration should be like "15 min", "25 min", "35 min"
Topic: {{TOPIC}}
Difficulty: {{DIFFICULTY}}
Duration: {{DURATION}}`,

  lessonContent: `You are an expert educator and content writer.
Return ONLY valid JSON with this exact shape:
{
  "explanation": "String (3-5 paragraphs of rich markdown-formatted theory content)",
  "key_concepts": [
    { "term": "String", "definition": "String (1-2 sentences)" }
  ],
  "examples": ["String (concrete real-world example)"],
  "takeaway": "String (one-sentence core insight)",
  "visual_suggestions": ["String (what a diagram or animation could show)"]
}
Rules:
- explanation must be detailed markdown (use **bold**, bullet points, headers)
- key_concepts: 3-5 terms
- examples: 2-3 examples
- Be specific to the lesson title and objective, not generic
Lesson Title: {{LESSON_TITLE}}
Lesson Objective: {{LESSON_OBJECTIVE}}
Course Topic: {{COURSE_TOPIC}}`,

  quiz: `You are an expert educator creating assessment questions.
Return ONLY valid JSON with this exact shape:
{
  "questions": [
    {
      "question": "String (clear, specific question)",
      "options": ["String", "String", "String", "String"],
      "correct_index": 0,
      "explanation": "String (why the correct answer is right, 2-3 sentences)"
    }
  ]
}
Rules:
- Generate exactly 5 questions
- correct_index is 0-based integer (which option is correct)
- Options should be plausible, not obviously wrong
- Questions should test understanding, not just recall
- Vary difficulty from easier to harder
Lesson Title: {{LESSON_TITLE}}
Lesson Content: {{LESSON_CONTENT}}`,

  manimScript: (topic, explanation) => `
    You are an expert Manim animator. Generate a self-contained Python script using the Manim library to create an educational explainer video.
    
    Topic: ${topic}
    Explanation: ${explanation}

    Requirements:
    1. Define a class named 'AutoScene' inheriting from 'Scene'.
    2. The script must be complete and executable with "manim -pql script.py AutoScene".
    3. Use professional colors (e.g., BLUE, GOLD, WHITE).
    4. Include clear text labels and smooth animations (Create, Write, FadeIn, Transform).
    5. The video should be approximately 15-30 seconds long with multiple logical steps.
    6. Ensure all mathematical formulas use MathTex if needed.
    7. Wrap the code in triple backticks: \`\`\`python ... \`\`\`.

    Example Structure:
    \`\`\`python
    from manim import *
    class AutoScene(Scene):
        def construct(self):
            title = Text("Example Topic").to_edge(UP)
            self.play(Write(title))
            # ... more animations ...
    \`\`\`
  `,

  videoScript: `You are a Manim animation engineer and educator.
Return ONLY valid JSON with this exact shape:
{
  "title": "String",
  "scenes": [
    {
      "type": "String",
      "narration": "String (1-2 sentences describing what is shown)"
    }
  ]
}
Rules:
- Generate 3-5 scenes
- Scene types MUST be exactly one of these strings:
  * "text" — for introductions, definitions, summaries
  * "diagram_process_threads" — for any topic about processes, concurrency, pipelines, workflows
  * "graph_derivative" — for any topic about calculus, functions, slopes, rates of change, optimization
  * "real_world_car_speed" — for physics, motion, velocity, distance-time relationships
- Choose the type based on topic content:
  * First scene ALWAYS "text" (introduce the topic)
  * Last scene ALWAYS "text" (key takeaway)
  * Middle scenes: pick the closest matching type
- narration should describe what the animation shows (not just restate the title)
- Never use markdown codeblocks, just raw JSON
Topic: {{TOPIC}}
Lesson Context: {{LESSON_CONTENT}}`
};
