const express = require("express");
const router = express.Router();
const playerController = require("../controllers/player.controller");
const { verifyToken,verifyTokenIfExists } = require("../middlewares/auth.middleware");


router.get("/all", playerController.index);
router.get("/players/:id", verifyTokenIfExists,playerController.detail);
router.post("/players/:id/comments", verifyToken, playerController.comment);
router.put("/players/:playerId/comments/:commentId", verifyToken, playerController.editComment);
router.delete("/players/:playerId/comments/:commentId", verifyToken, playerController.deleteComment);

module.exports = router;
