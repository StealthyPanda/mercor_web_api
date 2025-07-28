
// routes/employee.js
const express = require('express');
const router = express.Router();
const Organisation = require('../models/Organisation');
const bearerToken = require('../models/BearerToken');
const uuid = require('uuid');
const mongoose = require('mongoose');


//create a new organisation
router.post('/', async (req, res) => {
  const orgobj = {
    id: `org:${uuid.v4()}`,
    createdAt: Date.now(),
    ...req.body
  };

  // Create a bearer token for the organisation
  const token = new bearerToken({
      id: `token:${uuid.v4()}`,
      createdAt: orgobj.createdAt,
      token: orgobj.bearerToken,
      organisationId: orgobj.id
  });
  await token.save();
  
  const org = new Organisation(orgobj);
  await org.save();
  
  orgobj.bearerToken = token.id;
  res.send(orgobj);
});




// Get all organisations
router.get('/all', async (req, res) => {
    const organisations = await Organisation.find({});
    res.send(organisations);
});

//get organisation by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  const org = await Organisation.findOne({ id: id });
  if (!org) return res.status(404).send({ message: 'Organisation not found' });
  
  res.send(org);
});



module.exports = router;

