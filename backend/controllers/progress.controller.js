const { db } = require('../config/firebase');

exports.updateProgress = async (req, res) => {
  try {
    const { userId, courseId, lessonId, completed } = req.body;
    
    if (!userId || !courseId || !lessonId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (db) {
      // Create a document ID unique to this user/lesson
      const progressId = `${userId}_${lessonId}`;
      await db.collection('progress').doc(progressId).set({
        userId,
        courseId,
        lessonId,
        completed: !!completed,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    res.status(200).json({ message: 'Progress updated', data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
