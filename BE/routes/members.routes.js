const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/profile', verifyToken, memberController.getProfile);
router.put('/profile/update', verifyToken, memberController.updateProfile);
router.put('/profile/change-password', verifyToken, memberController.changePassword);

module.exports = router;
