const Member = require('../models/member.model');

exports.index = async (req, res) => {
  try {
    const members = await Member.find({ isAdmin: false }).sort({ createdAt: -1 });
    return res.status(200).json({
      message: 'Successfully retrieved member list',
      data: members
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to load member list',
      error: err.message
    });
  }
};