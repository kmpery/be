const express = require('express');
const RSVP = require('../models/rsvp');

const router = express.Router();

// POST RSVP
router.post('/', async (req, res) => {
  const { name, willAttend } = req.body;

  if (!name || !willAttend) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existingRSVP = await RSVP.findOne({ name: name.trim() });

    if (existingRSVP) {
      return res.status(409).json({ error: 'Nama ini sudah mengisi RSVP.' });
    }

    const newRSVP = new RSVP({ name: name.trim(), willAttend });
    await newRSVP.save();
    return res.status(201).json({ message: 'RSVP berhasil disimpan.' });
  } catch (error) {
    console.error('Error saving RSVP:', error);
    return res.status(500).json({ error: 'Gagal menyimpan RSVP.' });
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
