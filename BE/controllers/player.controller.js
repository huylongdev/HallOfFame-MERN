const Player = require("../models/player.model");
const Team = require("../models/team.model");

// ------- PUBLIC API -------

// [GET] /api/players?search=&team=
exports.index = async (req, res) => {
  try {
    const { search, team } = req.query;
    let query = {};
    if (search) query.playerName = { $regex: search, $options: "i" };
    if (team) query.team = team;

    const players = await Player.find(query).populate("team");
    const teams = await Team.find();

    res.status(200).json({ players, teams });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error loading player list", error: err.message });
  }
};

// [GET] /api/players/:id
exports.detail = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate("team")
      .populate("comments.author");

    if (!player)
      return res.status(404).json({ message: "Player not found" });

    let userCanComment = false;

    if (req.user) {
      const hasCommented = player.comments.find(
        (c) => c.author._id.toString() === req.user._id.toString()
      );
      userCanComment = !hasCommented;
    }

    res.status(200).json({
      player,
      userCanComment,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error loading player details", error: err.message });
  }
};

// [POST] /api/players/:id/comments
exports.comment = async (req, res) => {
  const { rating, content } = req.body;
  const playerId = req.params.id;

  try {
    const player = await Player.findById(playerId);
    if (!player)
      return res.status(404).json({ message: "Player does not exist" });

    const hasCommented = player.comments.find(
      (c) => c.author.toString() === req.user._id.toString()
    );

    if (hasCommented) {
      return res
        .status(400)
        .json({ message: "You have already rated this player." });
    }

    const newComment = {
      rating,
      content,
      author: req.user._id,
    };

    player.comments.push(newComment);
    await player.save();

    res.status(201).json({ message: "Rating successful", player });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error submitting rating", error: err.message });
  }
};

// [PUT] /api/players/:playerId/comments/:commentId
exports.editComment = async (req, res) => {
  const { playerId, commentId } = req.params;
  const { rating, content } = req.body;

  try {
    const player = await Player.findById(playerId);
    if (!player)
      return res.status(404).json({ message: "Player not found" });

    const comment = player.comments.id(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    // Only allow editing of own comments
    if (comment.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You do not have permission to edit this comment" });
    }

    comment.rating = rating;
    comment.content = content;
    await player.save();

    res.status(200).json({ message: "Comment updated successfully", player });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating comment", error: err.message });
  }
};

// [DELETE] /api/players/:playerId/comments/:commentId
exports.deleteComment = async (req, res) => {
  const { playerId, commentId } = req.params;

  try {
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ message: "Player not found" });

    const comment = player.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const authorId = comment.author?._id?.toString() || comment.author?.toString();
    if (authorId !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not have permission to delete this comment" });
    }

    // Safe way to remove subdocument
    player.comments.pull(commentId);
    await player.save();

    res.status(200).json({ message: "Comment deleted successfully", player });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Error deleting comment", error: err.message });
  }
};

// ------- ADMIN API -------

// [GET] /api/admin/players
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find().populate("team");
    res.status(200).json({ players });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error loading player list", error: err.message });
  }
};

// [POST] /api/admin/players
exports.create = async (req, res) => {
  const { playerName, image, cost, infomation, team } = req.body;
  const isCaptain = req.body.isCaptain === true;

  try {
    if (isCaptain) {
      const existingCaptain = await Player.findOne({ team, isCaptain: true });
      if (existingCaptain) {
        return res.status(400).json({ message: "This team already has a captain" });
      }
    }

    const newPlayer = await Player.create({
      playerName,
      image,
      cost,
      infomation,
      isCaptain,
      team,
    });

    res
      .status(201)
      .json({ message: "Player created successfully", player: newPlayer });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Player creation failed", error: err.message });
  }
};

// [PUT] /api/admin/players/:id
exports.update = async (req, res) => {
  const { playerName, image, cost, infomation, team } = req.body;
  const isCaptain = req.body.isCaptain === true;

  try {
    const playerId = req.params.playerId;

    if (isCaptain) {
      const existingCaptain = await Player.findOne({
        team,
        isCaptain: true,
        _id: { $ne: playerId },
      });

      if (existingCaptain) {
        return res
          .status(400)
          .json({ message: "This team already has another captain" });
      }
    }

    const updatedPlayer = await Player.findByIdAndUpdate(
      playerId,
      {
        playerName,
        image,
        cost,
        infomation,
        isCaptain,
        team,
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Update successful", player: updatedPlayer });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// [DELETE] /api/admin/players/:id
exports.remove = async (req, res) => {
  try {
    const player = await Player.findById(req.params.playerId);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // ❌ If there are comments, do not allow deletion
    if (player.comments && player.comments.length > 0) {
      return res.status(400).json({
        message: "Cannot delete player because there are ratings or comments",
      });
    }

    // ✅ If no comments, proceed with deletion
    await Player.findByIdAndDelete(req.params.playerId);

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Player deletion failed", error: err.message });
  }
};