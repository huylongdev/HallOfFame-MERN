const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

// GET /accounts – Admin only
router.get('/accounts', verifyToken, isAdmin, accountController.index);

module.exports = router;
