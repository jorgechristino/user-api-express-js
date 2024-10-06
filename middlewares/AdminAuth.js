const jwt = require("jsonwebtoken");
const secret = "0b89b93324ba40fdbf9f12b8d443a458";

// Middleware to protect administrative routes
function AdminAuth(req, res, next) {
  const authToken = req.headers["authorization"];

  if (!authToken) {
    return res.status(403).json({ error: "You are not authorized." });
  }

  const token = authToken.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);

    // Check if you are admin
    if (decoded.role == 1) {
      next();
    } else {
      return res.status(403).json({ error: "You are not authorized." });
    }
  } catch (error) {
    return res.status(403).json({ error: "You are not authorized." });
  }
}

module.exports = AdminAuth;
