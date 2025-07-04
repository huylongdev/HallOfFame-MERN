exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }

  return res.status(403).json({
    message: 'You do not have permission to access. Only Admins are allowed.',
  });
};