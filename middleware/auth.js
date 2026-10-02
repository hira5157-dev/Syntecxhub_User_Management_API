const User = require('../models/User');

const unauthorized = (res, message = 'Authentication required') =>
  res
    .status(401)
    .set('WWW-Authenticate', 'Basic realm="User Management API"')
    .json({ success: false, message });

// Basic Auth: Authorization: Basic base64(email:password)
exports.basicAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Basic ')) return unauthorized(res);

    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const sep = decoded.indexOf(':');
    if (sep === -1) return unauthorized(res, 'Malformed credentials');

    const email = decoded.slice(0, sep).trim().toLowerCase();
    const password = decoded.slice(sep + 1);

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return unauthorized(res, 'Invalid email or password');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Allow only the account owner or an admin
exports.selfOrAdmin = (req, res, next) => {
  const isSelf = req.user.id === req.params.id;
  if (isSelf || req.user.role === 'admin') return next();
  res.status(403).json({ success: false, message: 'Forbidden: not allowed to modify this user' });
};
