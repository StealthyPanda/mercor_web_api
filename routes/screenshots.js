// routes/screenshots.js
const express = require('express');
const router = express.Router();
const Screenshot = require('../models/Screenshots');

// POST /api/screenshots
router.post('/', async (req, res) => {
  try {
    const { employeeId, windowId, timestamp, screenshot } = req.body;
    console.log('posted ss');
    // Validate required fields
    if (!employeeId || !windowId || !screenshot) {
      return res.status(400).json({ 
        error: 'Missing required fields: employeeId, windowId, screenshot' 
      });
    }
    
    // Create new screenshot document
    const newScreenshot = new Screenshot({
      employeeId,
      windowId,
      timestamp: timestamp || new Date(),
      screenshot
    });
    
    // Save to database
    await newScreenshot.save();
    
    console.log(`Screenshot saved for employee ${employeeId}, window ${windowId}`);
    
    res.status(201).json({
      success: true,
      message: 'Screenshot saved successfully',
      screenshotId: newScreenshot._id
    });
    
  } catch (error) {
    console.error('Error saving screenshot:', error);
    res.status(500).json({ 
      error: 'Failed to save screenshot',
      details: error.message 
    });
  }
});

// GET /api/screenshots/employee/:employeeId
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const screenshots = await Screenshot.find({ employeeId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .select('-screenshot'); // Don't send the image data
    
    res.json({
      success: true,
      screenshots,
      count: screenshots.length
    });
    
  } catch (error) {
    console.error('Error fetching screenshots:', error);
    res.status(500).json({ 
      error: 'Failed to fetch screenshots',
      details: error.message 
    });
  }
});

// GET /api/screenshots/window/:windowId
router.get('/window/:windowId', async (req, res) => {
  try {
    const { windowId } = req.params;
    
    const screenshots = await Screenshot.find({ windowId })
      .sort({ timestamp: -1 })
      .select('-screenshot'); // Don't send the image data
    
    res.json({
      success: true,
      screenshots,
      count: screenshots.length
    });
    
  } catch (error) {
    console.error('Error fetching window screenshots:', error);
    res.status(500).json({ 
      error: 'Failed to fetch window screenshots',
      details: error.message 
    });
  }
});

module.exports = router;