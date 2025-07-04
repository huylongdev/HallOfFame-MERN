const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

router.use(verifyToken, isAdmin);

router.get('/teams', teamController.getAll);
router.post('/teams/create', teamController.create);
router.put('/teams/update/:teamId', teamController.update);
router.delete('/teams/:teamId', teamController.remove);

module.exports = router;
