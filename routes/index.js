const express = require('express');
const router = express.Router();
// const screenshotRoutes = require('./routes/screenshots');

router.use('/employee', require('./employee'));
router.use('/organisation', require('./organisation'));
router.use('/project', require('./project'));
router.use('/task', require('./task'));
router.use('/log', require('./log'));
router.use('/login', require('./login'));
router.use('/screenshots', require('./screenshots'));
// app.use('/api', screenshotRoutes);

module.exports = router;
