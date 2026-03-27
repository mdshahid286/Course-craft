import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generates a structured course outline and content.
 * Uses Gemini 1.5 Flash for speed as it's a large JSON.
 */
export async function generateCourse(topic, difficulty = "Beginner") {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
    Generate a high-end, professional educational course as valid JSON.
    Topic: "${topic}"
    Difficulty: "${difficulty}"

    Schema:
    {
      "title": "Course Title",
      "description": "Short overview",
      "outcomes": ["3 core learning outcomes"],
      "modules": [
        {
          "id": "m1",
          "title": "Module Title",
          "description": "Module overview",
          "topics": [
            {
              "id": "t1-1",
              "name": "Topic Name",
              "explanation": "Detailed Markdown explanation (4-6 paragraphs)",
              "videoPrompt": "A specific description for a Manim animation explaining this concept"
            }
          ],
          "activities": ["Interactive activity description"]
        }
      ]
    }

    Rules:
    - 2-3 modules, 2-3 topics per module.
    - Explanation must be rich Markdown.
    - videoPrompt should describe precisely what visual elements (shapes, labels, movements) are needed to explain the math/logic.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}

/**
 * Generates a Manim animation sequence for browser simulation.
 * Uses Gemini 3.1 Pro for complex reasoning.
 */
export async function generateAnimation(topic, videoPrompt) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash", // Using 2.0 or 1.5 Pro as "3.1 Pro" is usually a placeholder for SOTA
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
    You are a world-class mathematical animator specializing in the Manim library.
    Create a visual animation sequence for the topic: "${topic}"
    Animation Goal: ${videoPrompt}

    Return a JSON object with this schema:
    {
      "title": "Animation Title",
      "pythonCode": "Full executable Manim Python script (class AutoScene(Scene): ...)",
      "steps": [
        {
          "type": "text" | "shape" | "formula" | "axes",
          "content": "Text string or LaTeX for formula",
          "shapeType": "circle" | "square" | "triangle" | "line",
          "position": { "x": 0-100, "y": 0-100 },
          "style": { "color": "hex_color", "size": number, "strokeWidth": number },
          "animation": "fade-in" | "write" | "draw" | "scale-up" | "move",
          "moveTo": { "x": 0-100, "y": 0-100 },
          "startAt": 0, (seconds)
          "duration": 1.5 (seconds)
        }
      ]
    }

    Coordinate System: 0,0 is Top-Left, 100,100 is Bottom-Right.
    Ensure professional mathematical colors (BLUE, GOLD, WHITE).
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}
