const express = require('express');
const Comment = require('../models/comment');

const router = express.Router();

// POST kirim komentar
router.post('/', async (req, res) => {
  try {
    const { name, message } = req.body;
    const newComment = new Comment({ name, message });
    await newComment.save();
    res.status(201).json({ message: 'Komentar berhasil dikirim' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengirim komentar' });
  }
});

// GET semua komentar
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil komentar' });
  }
});

module.exports = router;
