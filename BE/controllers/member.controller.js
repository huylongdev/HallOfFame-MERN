const Member = require("../models/member.model");
const bcrypt = require("bcrypt");

// ✅ GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await Member.findById(req.user._id).select(
      "-password -isAdmin"
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving profile information" });
  }
};

// ✅ PUT /api/profile
exports.updateProfile = async (req, res) => {
  const { name, YOB } = req.body;
  const year = parseInt(YOB); 

  const currentYear = new Date().getFullYear();
  if (isNaN(year) || year > currentYear) {
    return res.status(400).json({ message: "Invalid year of birth." });
  }

  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.user._id,
      { name, YOB: year }, 
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "User does not exist" });
    }

    res.status(200).json({
      message: "Profile update successful",
      user: {
        id: updatedMember._id,
        name: updatedMember.name,
        YOB: updatedMember.YOB,
        membername: updatedMember.membername,
        isAdmin: updatedMember.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// ✅ PUT /api/profile/change-password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await Member.findById(req.user._id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const isSame = await bcrypt.compare(newPassword, user.password);

    if (isSame) {
      return res
        .status(400)
        .json({ message: "New password cannot be the same as the old password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error changing password" });
  }
};