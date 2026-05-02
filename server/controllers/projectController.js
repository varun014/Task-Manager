const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const validateObjectId = require('../utils/validateObjectId');
const asyncHandler = require('../utils/asyncHandler');

const getMemberUserId = (memberEntry) => {
  if (!memberEntry?.user) return null;
  if (typeof memberEntry.user === 'string') return memberEntry.user;
  if (memberEntry.user._id) return memberEntry.user._id.toString();
  return memberEntry.user.toString();
};

const getUserProjectRole = (project, userId) => {
  const member = project.members.find(
    (entry) => getMemberUserId(entry) === userId.toString()
  );

  return member ? member.role : null;
};

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ 'members.user': req.user._id })
    .populate('admin', 'name email')
    .populate('members.user', 'name email')
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    projects
  });
});

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description: description || '',
    admin: req.user._id,
    members: [{ user: req.user._id, role: 'Admin' }]
  });

  const populatedProject = await Project.findById(project._id)
    .populate('admin', 'name email')
    .populate('members.user', 'name email');

  return res.status(201).json({
    success: true,
    project: populatedProject
  });
});

const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid project id'
    });
  }

  const project = await Project.findById(id)
    .populate('admin', 'name email')
    .populate('members.user', 'name email');

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  const role = getUserProjectRole(project, req.user._id);
  if (!role) {
    return res.status(403).json({
      success: false,
      message: 'You are not a member of this project'
    });
  }

  return res.status(200).json({
    success: true,
    role,
    project
  });
});

const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid project id'
    });
  }

  const project = await Project.findById(id);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  const role = getUserProjectRole(project, req.user._id);
  if (role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Only project admins can update projects'
    });
  }

  if (typeof name === 'string') project.name = name;
  if (typeof description === 'string') project.description = description;

  await project.save();

  const updatedProject = await Project.findById(project._id)
    .populate('admin', 'name email')
    .populate('members.user', 'name email');

  return res.status(200).json({
    success: true,
    project: updatedProject
  });
});

const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid project id'
    });
  }

  const project = await Project.findById(id);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  const role = getUserProjectRole(project, req.user._id);
  if (role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Only project admins can delete projects'
    });
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Project deleted successfully'
  });
});

const addMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid project id'
    });
  }

  const project = await Project.findById(id);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  const role = getUserProjectRole(project, req.user._id);
  if (role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Only project admins can add members'
    });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found with that email'
    });
  }

  const alreadyMember = project.members.some(
    (entry) => getMemberUserId(entry) === user._id.toString()
  );

  if (alreadyMember) {
    return res.status(409).json({
      success: false,
      message: 'User is already a project member'
    });
  }

  project.members.push({ user: user._id, role: 'Member' });
  await project.save();

  const updatedProject = await Project.findById(project._id)
    .populate('admin', 'name email')
    .populate('members.user', 'name email');

  return res.status(200).json({
    success: true,
    message: 'Member added',
    project: updatedProject
  });
});

const removeMember = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;

  if (!validateObjectId(id) || !validateObjectId(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid project or user id'
    });
  }

  const project = await Project.findById(id);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  const role = getUserProjectRole(project, req.user._id);
  if (role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Only project admins can remove members'
    });
  }

  if (project.admin.toString() === userId) {
    return res.status(400).json({
      success: false,
      message: 'Project admin cannot be removed'
    });
  }

  const hasMember = project.members.some(
    (entry) => getMemberUserId(entry) === userId
  );

  if (!hasMember) {
    return res.status(404).json({
      success: false,
      message: 'Member not found in this project'
    });
  }

  project.members = project.members.filter(
    (entry) => getMemberUserId(entry) !== userId
  );

  await project.save();

  const updatedProject = await Project.findById(project._id)
    .populate('admin', 'name email')
    .populate('members.user', 'name email');

  return res.status(200).json({
    success: true,
    message: 'Member removed',
    project: updatedProject
  });
});

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};
