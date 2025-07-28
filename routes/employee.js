
// routes/employee.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Organisation = require('../models/Organisation');
const uuid = require('uuid');
const mongoose = require('mongoose');
const crypto = require('crypto');


function hashStringSHA256Node(message) {
  const hash = crypto.createHash('sha256'); // Create a SHA-256 hash object
  hash.update(message); // Update the hash with the data
  return hash.digest('hex'); // Return the hash in hexadecimal format
}


router.post('/', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const newid = `emp:${uuid.v4()}`;

  //add id to organisation
  const org = await Organisation.findOne({ id: orgId });
  if (!org) return res.status(404).send({ message: 'Organisation not found' });
  org.employees.push(newid);
  await org.save();

  req.body.password = hashStringSHA256Node(req.body.password);

  const emp = new Employee({
    id: newid,
    createdAt: Date.now(),

    accountId: uuid.v4(), 
    identifier: req.body.email,
    type: 'personal', 
    projects: [], 
    deactivated: 0,
    invited: 0,

    organisationId: orgId,
    ...req.body,
  });
  await emp.save();


  res.send(emp);
});


//put for updating an employee
router.put('/:id', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const { id } = req.params;

  const emp = await Employee.findOne({ id: id, organisationId: orgId });
  if (!emp) return res.status(404).send({ message: 'Employee not found' });

  // Update employee fields only from this list
  const allowedFields = ['name', 'email'];
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      emp[key] = req.body[key];
    }
  });
  await emp.save();
  res.send(emp);
});

router.get('/deactivate/:id', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const { id } = req.params;

  const emp = await Employee.findOne({ id: id, organisationId: orgId });
  if (!emp) return res.status(404).send({ message: 'Employee not found' });

  // Deactivate employee
  if (emp.deactivated === 0) {
    emp.deactivated = Date.now();
    await emp.save();
    res.send(emp);
  } else {
    res.status(400).send({ message: 'Employee is already deactivated' });
  }
});



// Get all employees
router.get('/all', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const employees = await Employee.find({ organisationId: orgId });
  res.send(employees);
});


//get employee by id
router.get('/:id', async (req, res) => {
  const orgId = req.tokenDoc.organisationId; // Get organisation ID from token document
  const { id } = req.params;

  const emp = await Employee.findOne({ id: id, organisationId: orgId });
  if (!emp) return res.status(404).send({ message: 'Employee not found' });
  
  res.send(emp);
});



module.exports = router;

