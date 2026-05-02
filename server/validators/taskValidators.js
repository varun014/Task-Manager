const { body } = require('express-validator');

const createTaskValidator = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('project').notEmpty().withMessage('Project id is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('assignedTo').optional({ nullable: true }).isString().withMessage('Assigned user id must be a string'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('status')
    .optional()
    .isIn(['To Do', 'In Progress', 'Done'])
    .withMessage('Status must be To Do, In Progress, or Done'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Due date must be a valid date')
];

const updateTaskValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('assignedTo').optional({ nullable: true }).isString().withMessage('Assigned user id must be a string'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('status')
    .optional()
    .isIn(['To Do', 'In Progress', 'Done'])
    .withMessage('Status must be To Do, In Progress, or Done'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Due date must be a valid date')
];

module.exports = { createTaskValidator, updateTaskValidator };
