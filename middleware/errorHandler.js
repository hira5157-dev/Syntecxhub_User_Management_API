const mongoose = require('mongoose');

// Reject malformed ObjectIds early
exports.validateId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid user id' });
  }
  next();
};

exports.notFound = (req, res) =>
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Email already in use' });
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
};
