module.exports = (...roles) => {
  return (req, res, next) => {
    const role = req.user.data.role;
    if (!roles.includes(role))
      return res.status(405).json({
        status: "error",
        message: "You Dont Have Permission",
      });
    return next();
  };
};
