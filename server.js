const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const db = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "",
    password: "",
    database: "codeswitch-db"
  }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(cors());

// Routes
// Root Checks Server Status
// -> Server Status {}
app.get("/", (req, res) => {
  res.json("Server OK.");
});

// -> [codesample]
app.post("/code_samples/search", (req, res) => {
  const { feature_ids, language_ids } = req.body;
  db("code_samples")
    .select("*")
    .whereIn("feature_id", feature_ids)
    .whereIn("language_id", language_ids)
    .then(results => res.json(results))
    .catch(err => res.status(400).json("Connection error."));
});

// -> [codesample]
app.get("/code_samples", (req, res) => {
  db("code_samples")
    .select("*")
    .then(samples => res.json(samples))
    .catch(err => res.status(400).json("Connection error."));
});

// Create new code sample
// -> success || error
app.post("/code_samples", (req, res) => {
  const { content, feature_id, language_id, source, user_id } = req.body;

  // Validations
  if (!content || !feature_id || !language_id || !user_id) {
    return res.status(400).json("Missing fields.");
  }

  db("code_samples")
    .insert({ content, feature_id, language_id, source, user_id })
    .then(data => res.json("Success."))
    .catch(err => res.status(400).json("Couldn't add code sample."));
});

// -> code_sample || error
app.get("/code_samples/:id/", (req, res) => {
  db("code_samples")
    .select("*")
    .where("id", req.params.id)
    .then(cs => {
      if (cs.length) {
        res.json(cs[0]);
      } else {
        res.status(404).json("Not found.");
      }
    })
    .catch(err => res.status(404).json("Connection error."));
});

// -> [Feature]
app.get("/features", (req, res) => {
  db("features")
    .select("*")
    .orderBy("name")
    .then(features => res.json(features))
    .catch(err => res.status(400).json("Connection error."));
});

// Add new feature.
// -> Feature || Error
app.post("/features", (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json("Bad Request.");
  }
  db("features")
    .insert({ name, description })
    .returning("*")
    .then(feat => res.json(feat[0]))
    .catch(err => res.status(400).json("Server couldn't add feature."));
});

// Update feature.
// -> Feature || Error
app.post("/features/:id", (req, res) => {
  const { name, description } = req.body;
  db("features")
    .where("id", req.params)
    .update({ name, description })
    .returning("*")
    .then(feat => res.json(feat[0]))
    .catch(err => res.status(400).json("Server couldn't update feature."));
});

// -> Success || Error
app.delete("/features/:id", (req, res) => {
  db("features")
    .where("id", req.params.id)
    .del()
    .then(response => res.json("Success."))
    .catch(err => res.status(400).json("Server couldn't delete feature."));
});

// -> [language]
app.get("/languages", (req, res) => {
  db("languages")
    .select("*")
    .orderBy("name")
    .then(languages => res.json(languages))
    .catch(err => res.status(400).json("Connection error."));
});

// -> Feature || Error
app.post("/languages", (req, res) => {
  const { name } = req.body;
  const syntax_code = req.body.syntax_code || name;
  if (!name) {
    return res.status(400).json("Bad Request.");
  }
  db("languages")
    .insert({ name, syntax_code })
    .returning("*")
    .then(lang => res.json(lang[0]))
    .catch(err => res.status(400).json("Server couldn't add language."));
});

// Update language
// -> Feature || Error
app.post("/languages/:id", (req, res) => {
  const { id } = req.params;
  const { name, syntax_code } = req.body;
  db("languages")
    .where("id", "=", id)
    .update({ name, syntax_code })
    .returning("*")
    .then(feat => res.json(feat[0]))
    .catch(err => res.status(400).json("Server couldn't update language"));
});

// -> Success || Error
app.delete("/languages/:id", (req, res) => {
  db("languages")
    .where("id", req.params.id)
    .del()
    .then(response => res.json("Success."))
    .catch(err => res.status(400).json("Server couldn't delete langauge."));
});

// -> User || Error
app.post("/signin", (req, res) => {
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
});

// -> User || Error
app.post("/signup", (req, res) => {
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
});

// -> [{id: Int, username: String }]
app.get("/usernames", (req, res) => {
  db("users")
    .select(["id", "username"])
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Connection error."));
});

// -> Success || Error
app.post("/vote", (req, res) => {
  const { cs_id, user_id, correctness, design, style } = req.body;

  // Validate code sample
  db("code_samples")
    .select("*")
    .where("id", cs_id)
    .then(cs => {
      if (cs.length) {
        let correctness_upvotes = cs[0].correctness_upvotes;
        let correctness_downvotes = cs[0].correctness_downvotes;
        let design_upvotes = cs[0].design_upvotes;
        let design_downvotes = cs[0].design_downvotes;
        let style_upvotes = cs[0].style_upvotes;
        let style_downvotes = cs[0].style_downvotes;
        if (correctness === "upvote") {
          correctness_downvotes = correctness_downvotes.filter(
            id => id !== user_id
          );
          if (!correctness_upvotes.includes(user_id)) {
            correctness_upvotes.push(user_id);
          }
        }
        if (correctness === "novote") {
          correctness_upvotes = correctness_upvotes.filter(
            id => id !== user_id
          );
          correctness_downvotes = correctness_downvotes.filter(
            id => id !== user_id
          );
        }
        if (correctness === "downvote") {
          correctness_upvotes = correctness_upvotes.filter(
            id => id !== user_id
          );
          if (!correctness_downvotes.includes(user_id)) {
            correctness_downvotes.push(user_id);
          }
        }
        if (design === "upvote") {
          design_downvotes = design_downvotes.filter(id => id !== user_id);
          if (!design_upvotes.includes(user_id)) {
            design_upvotes.push(user_id);
          }
        }
        if (design === "novote") {
          design_upvotes = design_upvotes.filter(id => id !== user_id);
          design_downvotes = design_downvotes.filter(id => id !== user_id);
        }
        if (design === "downvote") {
          design_upvotes = design_upvotes.filter(id => id !== user_id);
          if (!design_downvotes.includes(user_id)) {
            design_downvotes.push(user_id);
          }
        }
        if (style === "upvote") {
          style_downvotes = style_downvotes.filter(id => id !== user_id);
          if (!style_upvotes.includes(user_id)) {
            style_upvotes.push(user_id);
          }
        }
        if (style === "novote") {
          style_upvotes = style_upvotes.filter(id => id !== user_id);
          style_downvotes = style_downvotes.filter(id => id !== user_id);
        }
        if (style === "downvote") {
          style_upvotes = style_upvotes.filter(id => id !== user_id);
          if (!style_downvotes.includes(user_id)) {
            style_downvotes.push(user_id);
          }
        }
        // Update database
        return db("code_samples")
          .where("id", cs_id)
          .returning("*")
          .update({
            correctness_upvotes: JSON.stringify(correctness_upvotes),
            correctness_downvotes: JSON.stringify(correctness_downvotes),
            design_upvotes: JSON.stringify(design_upvotes),
            design_downvotes: JSON.stringify(design_downvotes),
            style_upvotes: JSON.stringify(style_upvotes),
            style_downvotes: JSON.stringify(style_downvotes)
          })
          .then(cs => res.json("Success"))
          .catch(err => res.status(400).json("Vote update failed."));
      } else {
        res.status(400).json("Couldn't find code sample.");
      }
    })
    .catch(err => res.status(400).json("Vote failed on server."));
});

// Launch
app.listen(port);
