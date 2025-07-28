
// routes/employee.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const Window = require('../models/Window');
const uuid = require('uuid');
const mongoose = require('mongoose');


//create a new task
router.post('/in', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const projectId = req.body.projectId; // Get project ID from request body
  const taskId = req.body.taskId;
  const employeeId = req.body.employeeId;


  // Clocking in

  //checking if the employee is already engaged in another window on any task...
  const otherWindows = await Window.find({
    employeeId : employeeId,
    organisationId : orgId,
  }).lean();
  const othersTask = otherWindows.filter(val => ((val.end === undefined)));
  if (othersTask.length) {
    res.statusCode = (305)
    res.send({ 
      message: 'Employee already clocked in! Must clock out before clocking in again!',
      otherWindow : othersTask
    });
    return;
  }

  

  // all clear

  const windowId = `win:${uuid.v4()}`;
  const newWindow = new Window({
    id : windowId,

    projectId : projectId,
    taskId : taskId,
    organisationId : orgId,

    type : "manual",

    start : Date.now(),

    employeeId : employeeId,

    createdAt : Date.now(),
    ...req.body
  });
  
  await newWindow.save();
  res.send(newWindow);
});




router.post('/out', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const windowId = req.body.windowId;

  if (!('windowId' in req.body)) {
    return res.status(402).send({
      message : 'windowId required in requst body!'
    });
  }

  //check if already clocked out

  const window = await Window.findOne({
    organisationId : orgId,
    id : windowId,
  });
  if (!window) return res.status(404).send({ message : 'Window not found!' });
  if (window.end !== undefined)
      return res.status(401).send({
        message : 'Already clocked out on this window!',
        window : window,
      });

  window.end = Date.now();
  window.updatedAt = Date.now();

  window.startTranslated = window.start + window.timezoneOffset;
  window.endTranslated = window.end + window.timezoneOffset;

  await window.save();
  res.send(window);
});


router.get('/', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const allWindows = await Window.find({ organisationId : orgId });
  return res.send(allWindows);
});


module.exports = router;

