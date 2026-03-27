const express = require('express');
const videoController = require('../controllers/video.controller');
const courseController = require('../controllers/course.controller');
const lessonController = require('../controllers/lesson.controller');
const progressController = require('../controllers/progress.controller');

const router = express.Router();

router.get('/ping', (req, res) => res.json({ message: 'pong' }));

// Video Routes
router.post('/video/generate', videoController.generate);
router.get('/video/status/:jobId', videoController.getStatus);

// Course Routes
router.post('/course/create', courseController.createCourse);
router.get('/course/list', courseController.listCourses);
router.get('/course/:id', courseController.getCourse);

// Lesson Routes
router.get('/lesson/:id', lessonController.getLesson);
router.post('/lesson/:id/video', lessonController.generateVideo);
router.post('/lesson/:id/quiz', lessonController.generateQuiz);

// Progress Routes
router.post('/progress/update', progressController.updateProgress);

module.exports = router;
