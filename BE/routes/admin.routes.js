const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

router.use(verifyToken, isAdmin);


router.post('/', playerController.create);                 

router.put('/:playerId', playerController.update);            
router.delete('/:playerId', playerController.remove);          

router.get('/', playerController.getAllPlayers);         

module.exports = router;
