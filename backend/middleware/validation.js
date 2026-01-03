/**
 * Input validation middleware
 * Validates common fields and prevents invalid data
 */

const validateProject = (req, res, next) => {
  const { title, description, budget } = req.body;

  // Check required fields
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Project title is required' });
  }

  if (!description || description.trim() === '') {
    return res.status(400).json({ error: 'Project description is required' });
  }

  if (!budget) {
    return res.status(400).json({ error: 'Budget is required' });
  }

  // Validate budget
  const budgetNum = Number(budget);
  if (isNaN(budgetNum) || budgetNum <= 0) {
    return res.status(400).json({ error: 'Budget must be a positive number' });
  }

  if (budgetNum < 10) {
    return res.status(400).json({ error: 'Budget must be at least $10' });
  }

  if (budgetNum > 1000000) {
    return res.status(400).json({ error: 'Budget cannot exceed $1,000,000' });
  }

  // Validate title length
  if (title.length < 5) {
    return res.status(400).json({ error: 'Title must be at least 5 characters' });
  }

  if (title.length > 200) {
    return res.status(400).json({ error: 'Title cannot exceed 200 characters' });
  }

  // Validate description length
  if (description.length < 20) {
    return res.status(400).json({ error: 'Description must be at least 20 characters' });
  }

  next();
};

const validateBid = (req, res, next) => {
  const { amount, proposal } = req.body;

  if (!amount) {
    return res.status(400).json({ error: 'Bid amount is required' });
  }

  const amountNum = Number(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return res.status(400).json({ error: 'Bid amount must be a positive number' });
  }

  if (!proposal || proposal.trim() === '') {
    return res.status(400).json({ error: 'Proposal is required' });
  }

  if (proposal.length < 20) {
    return res.status(400).json({ error: 'Proposal must be at least 20 characters' });
  }

  next();
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateRegistration = (req, res, next) => {
  const { name, email, password, user_type } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (!user_type || !['client', 'freelancer'].includes(user_type)) {
    return res.status(400).json({ error: 'Valid user type is required (client or freelancer)' });
  }

  next();
};

module.exports = {
  validateProject,
  validateBid,
  validateRegistration
};
