const jwt = require("jsonwebtoken");
const JWT_SECRET = "imsubhranil"; // match exactly

const fetchuser = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ error: "please use a valid token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ Fix here — only store decoded.user
    req.user = decoded.user;

    next();
  } catch (err) {
    return res.status(401).send({ error: "Invalid token" });
  }
};

module.exports = fetchuser;
