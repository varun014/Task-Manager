const Project = require('../models/Project');
const Task = require('../models/Task');
const validateObjectId = require('../utils/validateObjectId');
const asyncHandler = require('../utils/asyncHandler');

const getUserProjectRole = (project, userId) => {
  const member = project.members.find(
    (entry) => entry.user.toString() === userId.toString()
  );

  return member ? member.role : null;
};

const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id })
    .populate('project', 'name')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort({ dueDate: 1, createdAt: -1 });

  return res.status(200).json({
    success: true,
    tasks
  });
});

const getProjectTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!validateObjectId(projectId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid project id'
    });
  }

  const project = await Project.findById(projectId);
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

  const tasks = await Task.find({ project: projectId })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    tasks
  });
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, project: projectId, assignedTo, priority, dueDate, status } = req.body;

  if (!validateObjectId(projectId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid project id'
    });
  }

  const project = await Project.findById(projectId);
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
      message: 'Only project admins can create tasks'
    });
  }

  if (assignedTo) {
    if (!validateObjectId(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid assigned user id'
      });
    }

    const isMember = project.members.some(
      (entry) => entry.user.toString() === assignedTo.toString()
    );

    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user must be a member of this project'
      });
    }
  }

  const task = await Task.create({
    title,
    description: description || '',
    project: projectId,
    assignedTo: assignedTo || null,
    createdBy: req.user._id,
    priority: priority || 'Medium',
    dueDate: dueDate || null,
    status: status || 'To Do'
  });

  const populatedTask = await Task.findById(task._id)
    .populate('project', 'name')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  return res.status(201).json({
    success: true,
    task: populatedTask
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid task id'
    });
  }

  const task = await Task.findById(id)
    .populate('project', 'name members')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  const project = await Project.findById(task.project._id || task.project);
  const role = getUserProjectRole(project, req.user._id);

  if (!role) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to view this task'
    });
  }

  return res.status(200).json({
    success: true,
    task
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid task id'
    });
  }

  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  const project = await Project.findById(task.project);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found for this task'
    });
  }

  const role = getUserProjectRole(project, req.user._id);
  if (!role) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to update this task'
    });
  }

  const isAdmin = role === 'Admin';
  const isAssignee =
    task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

  if (!isAdmin && !isAssignee) {
    return res.status(403).json({
      success: false,
      message: 'Only project admin or assignee can update this task'
    });
  }

  if (!isAdmin) {
    const keys = Object.keys(req.body);
    if (keys.length !== 1 || keys[0] !== 'status') {
      return res.status(403).json({
        success: false,
        message: 'Members can only update task status'
      });
    }

    task.status = req.body.status;
    await task.save();
  } else {
    const { title, description, assignedTo, priority, dueDate, status } = req.body;

    if (typeof title === 'string') task.title = title;
    if (typeof description === 'string') task.description = description;
    if (typeof priority === 'string') task.priority = priority;
    if (typeof status === 'string') task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    if (assignedTo !== undefined) {
      if (assignedTo === null || assignedTo === '') {
        task.assignedTo = null;
      } else {
        if (!validateObjectId(assignedTo)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid assigned user id'
          });
        }

        const isMember = project.members.some(
          (entry) => entry.user.toString() === assignedTo.toString()
        );

        if (!isMember) {
          return res.status(400).json({
            success: false,
            message: 'Assigned user must be a member of this project'
          });
        }

        task.assignedTo = assignedTo;
      }
    }

    await task.save();
  }

  const updatedTask = await Task.findById(task._id)
    .populate('project', 'name')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  return res.status(200).json({
    success: true,
    task: updatedTask
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid task id'
    });
  }

  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  const project = await Project.findById(task.project);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found for this task'
    });
  }

  const role = getUserProjectRole(project, req.user._id);
  if (role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Only project admins can delete tasks'
    });
  }

  await task.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Task deleted successfully'
  });
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const projects = await Project.find({ 'members.user': req.user._id }).select('_id');
  const projectIds = projects.map((project) => project._id);

  if (!projectIds.length) {
    return res.status(200).json({
      success: true,
      stats: {
        totalTasks: 0,
        byStatus: { 'To Do': 0, 'In Progress': 0, Done: 0 },
        overdueTasks: 0,
        tasksByUser: []
      }
    });
  }

  const tasks = await Task.find({ project: { $in: projectIds } }).populate('assignedTo', 'name');

  const byStatus = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { 'To Do': 0, 'In Progress': 0, Done: 0 }
  );

  const now = new Date();
  const overdueTasks = tasks.filter(
    (task) => task.dueDate && task.dueDate < now && task.status !== 'Done'
  ).length;

  const tasksByUserMap = tasks.reduce((acc, task) => {
    const key = task.assignedTo?.name || 'Unassigned';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const tasksByUser = Object.entries(tasksByUserMap)
    .map(([user, count]) => ({ user, count }))
    .sort((a, b) => b.count - a.count);

  return res.status(200).json({
    success: true,
    stats: {
      totalTasks: tasks.length,
      byStatus,
      overdueTasks,
      tasksByUser
    }
  });
});

module.exports = {
  getMyTasks,
  getProjectTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats
};
