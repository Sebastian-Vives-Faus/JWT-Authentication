// Check if our email is valid or not.
module.exports = function (req, res, next) {
  const { email, name, password } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    //console.log(!email.length);
    if (![email, name, password].every(Boolean)) {
      // Empty values
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      // Check if email is valid
      return res.status(401).json("Invalid Email");
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      // Empty values
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      // Check if email is valid
      return res.status(401).json("Invalid Email");
    }
  }

  // Once everything completes and everything is okay, continue to the routes.
  next();
};
