const express = require('express');
const ctrl = require('../controllers/userController');
const { basicAuth, selfOrAdmin } = require('../middleware/auth');
const { validateId } = require('../middleware/errorHandler');

const router = express.Router();

router.post('/', ctrl.createUser); // public: register
router.get('/', basicAuth, ctrl.getUsers);
router.get('/:id', basicAuth, validateId, ctrl.getUser);
router.put('/:id', basicAuth, validateId, selfOrAdmin, ctrl.updateUser);
router.delete('/:id', basicAuth, validateId, selfOrAdmin, ctrl.deleteUser);

module.exports = router;
