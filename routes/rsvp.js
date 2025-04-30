const express = require('express');
const { RSVP } = require('../models/rsvp');

const router = express.Router();

// POST RSVP
router.post('/', async (req, res) => {
  const { name, willAttend } = req.body;

  if (!name || !willAttend) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newRSVP = new RSVP({ name, willAttend });
    await newRSVP.save();
    return res.status(201).json({ message: 'RSVP saved successfully' });
  } catch (error) {
    console.error('Error saving RSVP:', error);
    return res.status(500).json({ error: 'Failed to save RSVP' });
  }
});

// GET all RSVPs
router.get('/', async (_req, res) => {
  try {
    const rsvps = await RSVP.find().sort({ createdAt: -1 });
    return res.status(200).json(rsvps);
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return res.status(500).json({ message: 'Failed to fetch RSVPs' });
  }
});

module.exports = router;
