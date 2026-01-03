const express = require('express');
const router = express.Router();
const db = require('../database');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

// Get user's portfolio
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  
  db.all(
    `SELECT * FROM portfolio WHERE user_id = ? ORDER BY created_at DESC`,
    [userId],
    (err, items) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(items);
    }
  );
});

// Add portfolio item
router.post("/", authMiddleware, roleCheck(['freelancer']), (req, res) => {
  const { title, description, image_url, project_url, category, tags } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  db.run(
    `INSERT INTO portfolio (user_id, title, description, image_url, project_url, category, tags) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, title, description, image_url, project_url, category, tags],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ 
        id: this.lastID,
        message: 'Portfolio item added successfully' 
      });
    }
  );
});

// Upload portfolio image
router.post("/upload", authMiddleware, roleCheck(['freelancer']), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  res.json({ 
    image_url: `/uploads/${req.file.filename}`,
    message: 'Image uploaded successfully'
  });
});

// Update portfolio item
router.put("/:id", authMiddleware, roleCheck(['freelancer']), (req, res) => {
  const { id } = req.params;
  const { title, description, image_url, project_url, category, tags } = req.body;
  
  db.run(
    `UPDATE portfolio SET title = ?, description = ?, image_url = ?, project_url = ?, category = ?, tags = ?
     WHERE id = ? AND user_id = ?`,
    [title, description, image_url, project_url, category, tags, id, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Portfolio item not found' });
      }
      res.json({ message: 'Portfolio item updated successfully' });
    }
  );
});

// Delete portfolio item
router.delete("/:id", authMiddleware, roleCheck(['freelancer']), (req, res) => {
  const { id } = req.params;
  
  db.run(
    `DELETE FROM portfolio WHERE id = ? AND user_id = ?`,
    [id, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Portfolio item not found' });
      }
      res.json({ message: 'Portfolio item deleted successfully' });
    }
  );
});

module.exports = router;
