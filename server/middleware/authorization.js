const jwt = require("jsonwebtoken");
require("dotenv").config();

// Runs before the routes. If all is okay, next.
module.exports = async (req, res, next) => {
  try {
    // 1. Destructure the token from the fetch request.
    const jwtToken = req.header("token");

    // 2. Check if the token does exists
    if (!jwtToken) {
      return res.status(403).json("Not Authorized");
    } // If there's not even a token, you can't access

    // 3. If we do get a token, check if its valid
    const payload = jwt.verify(jwtToken, process.env.jwtSecret);

    req.user = payload.user;
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(403).json("Not Authorized"); // 403: Authorization
  }
};
