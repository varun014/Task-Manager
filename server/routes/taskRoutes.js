const express = require('express');
const {
  getMyTasks,
  getProjectTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const { createTaskValidator, updateTaskValidator } = require('../validators/taskValidators');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMyTasks);
router.get('/project/:projectId', getProjectTasks);
router.post('/', createTaskValidator, validationMiddleware, createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTaskValidator, validationMiddleware, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
