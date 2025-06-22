const jwt = require('jsonwebtoken');
const JWT_SECRET = "imsubhranil";

const fetchuser = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ error: 'please use a valid token' });
  }

  try {
    const token = authHeader.split(' ')[1]; // ✅ get actual token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user; // ✅ user ID is stored here
    next();
  } catch (err) {
    res.status(401).send({ error: 'Invalid token' });
  }
};

module.exports = fetchuser;
