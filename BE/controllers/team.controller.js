const Team = require('../models/team.model');
const Player = require('../models/player.model');

// [GET] /api/admin/teams
exports.getAll = async (req, res) => {
  try {
    const teams = await Team.find();
    return res.status(200).json({ teams });
  } catch (err) {
    return res.status(500).json({ message: 'Error loading team list', error: err.message });
  }
};

// [POST] /api/admin/teams
exports.create = async (req, res) => {
  try {
    const { teamName } = req.body;
    const newTeam = await Team.create({ teamName });
    return res.status(201).json({ message: 'Team created successfully', team: newTeam });
  } catch (err) {
    return res.status(500).json({ message: 'Error creating team', error: err.message });
  }
};

// [PUT] /api/admin/teams/:teamId
exports.update = async (req, res) => {
  try {
    const updated = await Team.findByIdAndUpdate(
      req.params.teamId,
      { teamName: req.body.teamName },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Team not found' });
    }

    return res.status(200).json({ message: 'Update successful', team: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// [DELETE] /api/admin/teams/:teamId
exports.remove = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const playerCount = await Player.countDocuments({ team: teamId });

    if (playerCount > 0) {
      return res.status(400).json({
        message: `Cannot delete team because there are still ${playerCount} players in this team.`,
      });
    }

    const deleted = await Team.findByIdAndDelete(teamId);

    if (!deleted) {
      return res.status(404).json({ message: 'Team not found to delete' });
    }

    return res.status(200).json({ message: 'Team deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Team deletion failed', error: err.message });
  }
};