

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const projectRoutes = require('./projects');
const bidRoutes = require('./bids');
const paymentRoutes = require('./payments');
const reviewRoutes = require('./reviews');
const userRoutes = require('./users');
const messageRoutes = require('./messages');
const portfolioRoutes = require('./portfolio');
const notificationRoutes = require('./notifications');
const adminRoutes = require('./admin');
const walletRoutes = require('./wallet');

// Mount routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/bids', bidRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);
router.use('/freelancers', userRoutes); // Freelancers routes (alias)
router.use('/messages', messageRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/wallet', walletRoutes);

module.exports = router;
