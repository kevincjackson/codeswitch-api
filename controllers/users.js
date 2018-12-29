const users = {};

// -> User || Error
users.handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Missing required fields.");
  }
  // Get user
  db("users")
    .select("email", "hash")
    .where("email", email)
    .then(user => {
      // Check password
      const valid = bcrypt.compareSync(password, user[0].hash);
      // If valid return user
      if (valid) {
        return db
          .select(["id", "username"])
          .from("users")
          .where("email", email)
          .then(user => res.json(user[0]))
          .catch(err => res.status(400).json("Unable to get user."));
      } else {
        res.status(400).json("Authentication failed.");
      }
    })
    .catch(err => res.status(400).json("Authentication failed."));
};

// -> User || Error
users.handleSignup = (req, res, db, bcrypt) => {
  const { email, password, username } = req.body;

  // Validate non-blanks
  if (!email || !password || !username) {
    return res.status(400).json("Missing required fields.");
  }

  // Database submit
  db("users")
    .select("email", "username")
    .then(users => {
      // Validate unique email
      if (users.find(u => u.email === email)) {
        return res.status(400).json("Email taken.");
        // Validate unique username
      } else if (users.find(u => u.username === username)) {
        return res.status(400).json("Username taken.");
        // Insert new user
      } else {
        const hash = bcrypt.hashSync(password);
        db("users")
          .insert({ email, hash, username })
          .returning(["id", "username"])
          .then(user => res.json(user[0]))
          .catch(err => res.status(400).json("Signup failed."));
      }
    })
    .catch(err => res.status(400).json("Connection error."));
};

// -> [{id: Int, username: String }]
users.handleUsernames = (req, res, db) => {
  db("users")
    .select(["id", "username"])
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Connection error."));
};

module.exports = users;
