
// routes/employee.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Organisation = require('../models/Organisation');
const uuid = require('uuid');
const mongoose = require('mongoose');


//create a new project
router.post('/', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const newid = `proj:${uuid.v4()}`;
  
  //add id to organisation
  const org = await Organisation.findOne({ id: orgId });
  if (!org) return res.status(404).send({ message: 'Organisation not found' });
  org.projects.push(newid);
  await org.save();

  const project = new Project({
    id: newid,
    createdAt: Date.now(),

    organisationId: orgId,
    ...req.body
  });
  await project.save();
  res.send(project);
});


//put for updating a project
router.put('/:id', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const { id } = req.params;

  const project = await Project.findOne({ id: id, organisationId: orgId });
  if (!project) return res.status(404).send({ message: 'Project not found' });

  // Update project fields only from this list
  const allowedFields = ['name', 'description', 'statuses', 'priorities', 'billable', 'deadline'];
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      project[key] = req.body[key];
    }
  });
  await project.save();
  res.send(project);
});

//delete a project
router.delete('/:id', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const { id } = req.params;

  const project = await Project.findOneAndDelete({ id: id, organisationId: orgId });
  if (!project) return res.status(404).send({ message: 'Project not found' });

  // Remove project ID from organisation
  const org = await Organisation.findOne({ id: orgId });
  if (org) {
    org.projects = org.projects.filter(projId => projId !== id);
    await org.save();
  }

  res.send({ message: 'Project deleted successfully' });
});

// Get all projects
router.get('/all', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const projects = await Project.find({ organisationId: orgId });
  res.send(projects);
});

//get project by id
router.get('/:id', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  if (!orgId) return res.status(401).send({ message: 'Unauthorized' });
  const { id } = req.params;

  const project = await Project.findOne({ id: id, organisationId: orgId });
  if (!project) return res.status(404).send({ message: 'Project not found' });

  res.send(project);
});



module.exports = router;

