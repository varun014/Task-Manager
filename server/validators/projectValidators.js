const { body } = require('express-validator');

const createProjectValidator = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('description').optional().isString().withMessage('Description must be a string')
];

const updateProjectValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().isString().withMessage('Description must be a string')
];

const addMemberValidator = [
  body('email').isEmail().withMessage('Valid member email is required').normalizeEmail()
];

module.exports = {
  createProjectValidator,
  updateProjectValidator,
  addMemberValidator
};
