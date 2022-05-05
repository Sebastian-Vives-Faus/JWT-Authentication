// Modules
const router = require("express").Router();
const pool = require("../database/db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

// MIDDLEWARE

// Register Route
router.post("/register", validInfo, async (req, res) => {
  try {
    // 1. Destrucutre the req.body (name, email, password)

    const { name, email, password } = req.body;

    // 2. Check if user exists (if yes, error)

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    // If user already exists
    if (user.rows.length !== 0) {
      return res.status(401).json("User already exists"); // 401: Unauthenticated
    }

    // 3. Bcrypt user password

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    console.log(salt);

    // Start encryption
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Enter the new user inside the database
    const response = await pool.query(
      " INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", // ! important
      [name, email, bcryptPassword] // We want to save the encrypted password
    );

    // 5. Generate JWT Token

    const token = jwtGenerator(response.rows[0].user_id);

    res.status(200).json({ token });
  } catch (error) {
    console.log(error.message);
    // If something is wrong, we have a server error
    res.status(500).send("Server error");
  }
});

// Login Route
router.post("/login", validInfo, async (req, res) => {
  try {
    // 1. Destrucutre req.body
    const { email, password } = req.body;

    // 2. Check if user doesn't exist
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    // If user doesnt exist
    if (user.rows.length === 0) {
      return res.status(401).json("User doesn't exist"); // 401: Unauthenticated
    }

    // 3. Check if incoming password matches the DB password

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    ); // Returns boolean

    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect.");
    }

    // 4. Send JWT Token

    const token = jwtGenerator(user.rows[0].user_id);

    res.status(200).json({ token });
  } catch (error) {
    console.log(error.message);
    // If something is wrong, we have a server error
    res.status(500).send("Server error");
  }
});

// Verify Authentication
router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.log(error.message);
    // If something is wrong, we have a server error
    res.status(500).send("Server error");
  }
});

// Exports
module.exports = router;
