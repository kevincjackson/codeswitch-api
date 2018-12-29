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

// Controllers
const code_samples = require("./controllers/code_samples");
const features = require("./controllers/features");
const languages = require("./controllers/languages");
const users = require("./controllers/users");
const vote = require("./controllers/vote");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(cors());

// Routes
app.get("/", (req, res) => res.json("Server OK."));
app.post("/code_samples/search", (req, res) => code_samples.handleSearch(req, res, db));
app.get("/code_samples", (req, res) => code_samples.handleGet(req, res, db));
app.post("/code_samples", (req, res) => code_samples.handlePost(req, res, db));
app.get("/code_samples/:id/", (req, res) => code_samples.handleIdGet(req, res, db));
app.get("/features", (req, res) => features.handleGet(req, res, db));
app.post("/features", (req, res) => features.handlePost(req, res, db));
app.post("/features/:id", (req, res) => features.handleIdGet(req, res, db));
app.delete("/features/:id", (req, res) => features.handleDelete(req, res, db));
app.get("/languages", (req, res) => languages.handleGet(req, res, db));
app.post("/languages", (req, res) => languages.handlePost(req, res, db));
app.post("/languages/:id", (req, res) => languages.handleIdGet(req, res, db));
app.delete("/languages/:id", (req, res) => languages.handleDelete(req, res, db));
app.post("/signin", (req, res) => users.handleSignin(req, res, db, bcrypt));
app.post("/signup", (req, res) => users.handleSignup(req, res, db, bcrypt));
app.get("/usernames", (req, res) => users.handleUsernames(req, res, db));
app.post("/vote", (req, res) => vote.handlePost(req, res, db))

// Launch
app.listen(port);
