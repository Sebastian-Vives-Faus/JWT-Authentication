const jwt = require("jsonwebtoken");
require("dotenv").config(); // Acces to enviroment variables.

const jwtGenerator = (user_id) => {
  const payload = {
    user: user_id,
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" });
};

module.exports = jwtGenerator;
