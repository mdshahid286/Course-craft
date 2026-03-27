const geminiService = require('../../ai-engine/gemini.service');
const videoService = require('../services/video.service');

exports.getLesson = async (req, res) => {
  try {
    const { title, objective, topic } = req.query;
    if (!title || !topic) {
      return res.status(400).json({ error: 'title and topic query params are required' });
    }
    const content = await geminiService.generateLessonContent({
      lessonTitle: title,
      lessonObjective: objective || '',
      courseTopic: topic,
    });
    res.status(200).json({ title, content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateVideo = async (req, res) => {
  try {
    const { topic, videoScript, explanation } = req.body;
    if (!topic) return res.status(400).json({ error: 'topic is required' });

    const result = await videoService.generateFromTopic(topic, {
      skipOutline: true,
      asyncRender: true,
      videoScript,
      explanation
    });

    res.status(200).json({
      message: 'Video rendering started.',
      jobId: result.jobId,
      script: result.videoScript,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateQuiz = async (req, res) => {
  try {
    const { lessonTitle, lessonContent } = req.body;
    if (!lessonTitle) return res.status(400).json({ error: 'lessonTitle is required' });

    const quiz = await geminiService.generateQuiz({ lessonTitle, lessonContent });
    res.status(200).json({ quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
