
// routes/employee.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const Employee = require('../models/Employee');
const Organisation = require('../models/Organisation');
const BearerToken = require('../models/BearerToken');
const Window = require('../models/Window');
const uuid = require('uuid');
const mongoose = require('mongoose');

const crypto = require('crypto');


function hashStringSHA256Node(message) {
  const hash = crypto.createHash('sha256'); // Create a SHA-256 hash object
  hash.update(message); // Update the hash with the data
  return hash.digest('hex'); // Return the hash in hexadecimal format
}


router.post('/', async (req, res) => {
  const orgId = req.tokenDoc.organisationId;
  const email = req.body.email;
  const password = hashStringSHA256Node(req.body.password);
  console.log('hashed ' + password);

  // look for the employee
  const employee = await Employee.findOne({
    email : email,
    password : password,
  });
  if (!employee) return res.status(404).send({ message : "Invalid credentials!" });
  
  //look for the organisation
  const organisationId = employee.organisationId;

  //look for its bearer token
  const token = (await BearerToken.findOne({ organisationId : organisationId })).id;

  res.send({ employeeId : employee.id, token : token });
});





module.exports = router;

