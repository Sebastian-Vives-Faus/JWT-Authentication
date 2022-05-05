# JWT Authentication with PERN Stack.

### Authentication VS Authorization

- Authentication is the process of checking if you really are the person you claim to be.
- Authorization (comes after authentication) is the process of checking of depending of your status. Checking the role, which rights.

### 1. Create Server, Database and Table

> cd \server npm init -y

##### package.json initial scripts:

```js
"start": "node index.js",
"dev": "nodemon index.js"
```

This will make nodemon available during developmet and start during production.

##### initial dependencies:

- express
- cors
- pg
- jsonwebtoken (_generate jsonwebtoken and verify it_)
- bcrypt (_encrypt our passwords_)
- nodemon

#### Access PostgreSQL from command line

> psql -U < user >

##### Useful commands:

- **\l :** List all databases.
- **\c < database name >:** Access specific database

### Authentication System

#### Register System

**!! RULE: Always use try catch !!**

##### 1. We destructure the form from the request (req.body)

```js
const { name, email, password } = req.body;
```

We have access to **req.body** by using:

```js
app.use(express.json());
```

##### 2. Check if the user exists in our Database

We do a query to our psql db to get a user:

```js
const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
  email,
]);
```

If we get a user, it means there is already a user registered in our database:

```js
// If user already exists
if (user.rows.length !== 0) {
  return res.status(401).json("User already exists"); // 401: Unauthenticated
}
```

##### 3. Encrypt the user's password

A **salt** is a random string. By hashing a plain text password plus a salt, the hash algorithm’s output is no longer predictable.

First we define the salt and add them to our password:

```js
const saltRounds = 10;
const salt = await bcrypt.genSalt(saltRounds);

// For example: $2b$10$xdZPnwlEmK5WTD3AMkXZn.
```

Then we hash the password + the salt:

```js
// Start encryption
const bcryptPassword = await bcrypt.hash(password, salt);
```

##### 4. We add the user to our database

```js
// 4. Enter the new user inside the database
const response = await pool.query(
  " INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", // ! important
  [name, email, bcryptPassword] // We want to save the encrypted password
);
```

##### 5. We generate JWT Token

Using our util **jwtGenerator**.

```js
const token = jwtGenerator(response.rows[0].user_id);
```

#### Login System

**!! RULE: Always use try catch !!**

##### 1. We destructure the form from the request (req.body)

```js
// 1. Destrucutre req.body
const { email, password } = req.body;
```

##### 2. Check if the user exists in our Database

If it doesn't exist, we return an 401 error:

```js
// 2. Check if user doesn't exist
const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
  email,
]);

// If user doesnt exist
if (user.rows.length === 0) {
  return res.status(401).json("User doesn't exist"); // 401: Unauthenticated
}
```

##### 3. Check if incoming password matches the DB password

We can compare it by using **bcrypt**:

```js
const validPassword = await bcrypt.compare(
  password,
  user.rows[0].user_password
); // Returns boolean

if (!validPassword) {
  return res.status(401).json("Password or Email is incorrect.");
}
```

##### 4. Create and send their JWT Token

```js
const token = jwtGenerator(user.rows[0].user_id);

// Send token
res.status(200).json({ token });
```

#### JWT Token Generator

We take a _user_id_, create a **payload** out of it, and then we _sign it_

sign: payload, our secret key, and expiration date for the token.

```js
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
```

### Authorization System

##### 1. How to check how a JWT Token is valid.

By using a middleware, for example (authorization):

```js
router.get("/", authorization, async (req, res) => {
```

Its going to check the header to determine if there is a token.
If it exists, it going to verify it and save it as the payload.
If it's verified, we can use the user_id as a parameter.

```js
// authorization.js
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
```
