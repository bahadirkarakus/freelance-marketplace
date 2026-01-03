const express = require('express');
const router = express.Router();
const db = require('../database');
const authMiddleware = require('../middleware/auth');

// Test endpoint
router.post("/test", (req, res) => {
  console.log('TEST ENDPOINT HIT');
  console.log('Request body:', req.body);
  res.json({ message: "Test successful", body: req.body });
});

// Create review (Protected)
router.post("/", authMiddleware, (req, res) => {
  console.log('=== REVIEW POST REQUEST ===');
  console.log('Full request body:', JSON.stringify(req.body, null, 2));
  console.log('Headers:', req.headers['content-type']);
  
  const { project_id, reviewee_id, rating, comment } = req.body;
  const reviewer_id = req.user.id;

  console.log('Review request body:', req.body);
  console.log('Reviewee ID received:', reviewee_id, typeof reviewee_id);
  console.log('Rating received:', rating, typeof rating);
  console.log('Comment received:', comment);

  // Validate required fields
  if (!reviewee_id || (typeof reviewee_id === 'string' && reviewee_id.trim() === '')) {
    console.log('VALIDATION FAILED: Reviewee ID missing');
    return res.status(400).json({ error: "Reviewee ID is required" });
  }

  // Convert to number if it's a string
  const revieweeIdNum = parseInt(reviewee_id);
  if (isNaN(revieweeIdNum)) {
    console.log('VALIDATION FAILED: Reviewee ID not a number');
    return res.status(400).json({ error: "Reviewee ID must be a valid number" });
  }

  if (!rating || rating < 1 || rating > 5) {
    console.log('VALIDATION FAILED: Rating invalid');
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  if (!comment || !comment.trim()) {
    console.log('VALIDATION FAILED: Comment missing');
    return res.status(400).json({ error: "Comment is required" });
  }

  console.log('ALL VALIDATIONS PASSED');

  // Check if review already exists (only if project_id is provided)
  const checkQuery = project_id 
    ? "SELECT id FROM reviews WHERE project_id = ? AND reviewer_id = ?"
    : "SELECT id FROM reviews WHERE project_id IS NULL AND reviewer_id = ? AND reviewee_id = ?";
  
  const checkParams = project_id 
    ? [project_id, reviewer_id]
    : [reviewer_id, revieweeIdNum];

  db.get(checkQuery, checkParams, (err, existingReview) => {
    if (err) return res.status(500).json({ error: err.message });
    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this project or freelancer" });
    }

    // Insert review
    db.run(
      `INSERT INTO reviews (project_id, reviewer_id, reviewee_id, rating, comment) 
       VALUES (?, ?, ?, ?, ?)`,
      [project_id || null, reviewer_id, revieweeIdNum, rating, comment],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Update user's average rating
        db.get(
          "SELECT AVG(rating) as avg_rating FROM reviews WHERE reviewee_id = ?",
          [revieweeIdNum],
          (err, result) => {
            if (err) console.error(err);
            if (result && result.avg_rating) {
              db.run(
                "UPDATE users SET rating = ? WHERE id = ?",
                [result.avg_rating, revieweeIdNum]
              );
            }
          }
        );

        res.status(201).json({ 
          id: this.lastID, 
          message: "Review submitted successfully" 
        });
      }
    );
  });
});

// Get reviews for a user
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  db.all(
    `SELECT r.*, 
            u.name as reviewer_name,
            u.profile_picture as reviewer_picture,
            p.title as project_title
     FROM reviews r
     JOIN users u ON r.reviewer_id = u.id
     LEFT JOIN projects p ON r.project_id = p.id
     WHERE r.reviewee_id = ?
     ORDER BY r.created_at DESC`,
    [userId],
    (err, reviews) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(reviews);
    }
  );
});

// Get review stats for a user
router.get("/:userId/stats", (req, res) => {

  db.get(
    `SELECT 
       COUNT(*) as total_reviews,
       AVG(rating) as avg_rating,
       SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
       SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
       SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
       SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
       SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
     FROM reviews 
     WHERE reviewee_id = ?`,
    [req.params.userId],
    (err, stats) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Frontend'in beklediği formata dönüştür
      res.json({
        totalReviews: stats.total_reviews || 0,
        averageRating: stats.avg_rating || 0,
        ratingDistribution: {
          5: stats.five_star || 0,
          4: stats.four_star || 0,
          3: stats.three_star || 0,
          2: stats.two_star || 0,
          1: stats.one_star || 0
        }
      });
    }
  );
});

module.exports = router;
