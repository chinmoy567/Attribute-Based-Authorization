export const authorize = (policy, resource) => {
  return (req, res, next) => {
    // We expect the policy to return an object: { permitted: boolean, reason: string }
    // If it returns a boolean directly, handle that for backward compatibility
    let result = policy(req.user, resource);
    
    // Normalize result
    if (typeof result === "boolean") {
      result = { permitted: result, reason: result ? "Access granted." : "Access denied by policy." };
    }

    if (result.permitted) {
      // Pass the reason along so controllers can use it if needed
      req.accessReason = result.reason;
      next();
    } else {
      res.status(403).json({
        status: 403,
        message: "Forbidden",
        reason: result.reason
      });
    }
  };
};