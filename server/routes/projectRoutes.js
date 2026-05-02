const express = require('express');
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const {
  createProjectValidator,
  updateProjectValidator,
  addMemberValidator
} = require('../validators/projectValidators');

const router = express.Router();

router.use(authMiddleware);

router.route('/').get(getProjects).post(createProjectValidator, validationMiddleware, createProject);

router
  .route('/:id')
  .get(getProjectById)
  .put(updateProjectValidator, validationMiddleware, roleMiddleware('Admin'), updateProject)
  .delete(roleMiddleware('Admin'), deleteProject);

router.post(
  '/:id/members',
  addMemberValidator,
  validationMiddleware,
  roleMiddleware('Admin'),
  addMember
);

router.delete('/:id/members/:userId', roleMiddleware('Admin'), removeMember);

module.exports = router;
