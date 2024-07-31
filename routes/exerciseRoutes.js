const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');


// routes
router.post('/users/:_id/exercises', exerciseController.addExercise);
router.get('/users/:_id/logs', exerciseController.getExerciseLogs);

module.exports = router;
