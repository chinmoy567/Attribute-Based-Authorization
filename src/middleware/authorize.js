export const authorize = (policy, resource) => (req, res, next) => {
  const user = req.user;
  const decision = policy(user, resource);

  if (decision?.permitted) {
    req.accessReason = decision.reason || null;
    return next();
  } else {
    return res.status(403).json({
      status: 403,
      message: "Access denied",
      reason: decision?.reason || "Policy denied access.",
    });
  }
};