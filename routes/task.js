import express from 'express';

import TaskController from '../controllers/task.js';

const router = express.Router();

router.get('/', TaskController.getAllTasks); 
router.get('/new', TaskController.newTask);
router.get('/new/:name', TaskController.newTask);
router.get('/task/:id', TaskController.getTaskById);
router.get('/task/:id/start', TaskController.startTimedTask);
router.get('/task/:id/end', TaskController.endTimedTask);
export default router;
 
