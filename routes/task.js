
// routes/employee.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const Organisation = require('../models/Organisation');
const uuid = require('uuid');
const mongoose = require('mongoose');


//create a new task
router.post('/', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const newid = `task:${uuid.v4()}`;
  const projectId = req.body.projectId; // Get project ID from request body
  
  //check if project exists
  const project = await Project.findOne({ id: projectId, organisationId: orgId });
  if (!project) return res.status(404).send({ message: 'Project not found' });


  const task = new Task({
    id: newid,
    createdAt: Date.now(),
    organisationId: orgId,
    projectId: projectId,
    ...req.body
  });
  await task.save();
  res.send(task);
});


//put for updating a task
router.put('/:id', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const { id } = req.params;

  const task = await Task.findOne({ id: id, organisationId: orgId });
  if (!task) return res.status(404).send({ message: 'Task not found' });

  // Update task fields only from this list
  const allowedFields = ['name', 'description', 'status', 'employees', 'billable'];
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      task[key] = req.body[key];
    }
  });
  await task.save();
  res.send(task);
});

//delete a task
router.delete('/:id', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const { id } = req.params;

  const task = await Task.findOneAndDelete({ id: id, organisationId: orgId });
  if (!task) return res.status(404).send({ message: 'Task not found' });

  res.send({ message: 'Task deleted successfully' });
});

// Get all tasks
router.get('/all', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const tasks = await Task.find({ organisationId: orgId });
  res.send(tasks);
});

//get task by id
router.get('/:id', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  if (!orgId) return res.status(401).send({ message: 'Unauthorized' });
  const { id } = req.params;

  const task = await Task.findOne({ id: id, organisationId: orgId });
  if (!task) return res.status(404).send({ message: 'Task not found' });

  res.send(task);
});

// Get tasks by project ID



module.exports = router;

