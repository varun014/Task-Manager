const Project = require('../models/Project');
const validateObjectId = require('../utils/validateObjectId');

const roleMiddleware = (requiredRole = 'Admin') => {
  return async (req, res, next) => {
    try {
      const projectId = req.params.id || req.params.projectId || req.body.project;

      if (!projectId || !validateObjectId(projectId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid project id is required'
        });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const member = project.members.find(
        (entry) => entry.user.toString() === req.user._id.toString()
      );

      if (!member) {
        return res.status(403).json({
          success: false,
          message: 'You are not a member of this project'
        });
      }

      if (requiredRole && member.role !== requiredRole) {
        return res.status(403).json({
          success: false,
          message: `Only ${requiredRole}s can perform this action`
        });
      }

      req.project = project;
      req.projectRole = member.role;
      return next();
    } catch (error) {
      return next(error);
    }
  };
};

module.exports = roleMiddleware;
