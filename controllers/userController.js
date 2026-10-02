const User = require('../models/User');

// POST /api/users  (public - registration)
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // The very first account becomes the admin; everyone else is a normal user
    const isFirst = (await User.countDocuments()) === 0;
    const user = await User.create({ name, email, password, role: isFirst ? 'admin' : 'user' });

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// GET /api/users?page=1&limit=10
exports.getUsers = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      User.countDocuments(),
    ]);

    res.json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id  (owner or admin)
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { name, email, password, role } = req.body;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (password !== undefined) user.password = password; // re-hashed by pre-save hook
    if (role !== undefined && req.user.role === 'admin') user.role = role; // only admins change roles

    await user.save(); // runs validators + hashing
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id  (owner or admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
