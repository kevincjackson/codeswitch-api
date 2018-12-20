const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const database = {
  users: [
    {
      admin: true,
      email: "kevin@example.com",
      hash: "$2a$10$yvhRTCkCGb72nR8kk1Ia3OYZiPiilD4NtAkUl/RIAjkMufI0B9Nem",
      id: 1,
      moderator: true,
      username: "kj"
    }
  ],
  languages: [
    { id: 1, name: "C" },
    { id: 2, name: "Javascript" },
    { id: 3, name: "Python" }
  ],
  features: [
    { id: 1, name: "Comment" },
    { id: 2, name: "Variable Declaration" },
    { id: 3, name: "Loop" },
    { id: 4, name: "Hello World" }
  ],
  code_samples: [
    {
      id: 1,
      content: "/* My C comment */",
      correctness_upvotes: [1,2,3],
      correctness_downvotes: [4],
      design_upvotes: [1,2],
      design_downvotes: [],
      feature_id: 1,
      language_id: 1,
      source: "",
      style_upvotes: [2,3,4],
      style_downvotes: [5],
      user_id: 1
    },
    {
      id: 2,
      content: "// My single line comment\n\n/* My\n multiline\ncomment */",
      correctness_upvotes: [],
      correctness_downvotes: [],
      design_upvotes: [],
      design_downvotes: [],
      feature_id: 1,
      language_id: 2,
      ratings: [],
      source: "",
      style_upvotes: [],
      style_downvotes: [],
      user_id: 1
    },
    {
      id: 3,
      content: "# My Python comment",
      correctness_upvotes: [],
      correctness_downvotes: [],
      design_upvotes: [],
      design_downvotes: [],
      feature_id: 1,
      language_id: 3,
      ratings: [],
      source: "",
      style_upvotes: [],
      style_downvotes: [],
      user_id: 1
    },
    {
      id: 4,
      content: "int i = 42;",
      correctness_upvotes: [],
      correctness_downvotes: [],
      design_upvotes: [],
      design_downvotes: [],
      feature_id: 1,
      language_id: 1,
      ratings: [],
      source: "",
      style_upvotes: [],
      style_downvotes: [],
      user_id: 1
    },
    {
      id: 5,
      content: "const i = 42;",
      feature_id: 2,
      language_id: 2,
      ratings: [],
      source: "",
      user_id: 1
    },
    {
      id: 6,
      content: "i = 42",
      feature_id: 2,
      language_id: 3,
      ratings: [],
      source: "",
      user_id: 1
    }
  ]
};

// Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cors());

// Routes
// Root Checks Server Status
// -> Server Status {}
app.get('/', (req, res) => {
  res.json("Server OK.");
});

// -> [codesample]
app.get('/code_samples', (req, res) => {
  res.json(database.code_samples);
});

// Create new code sample
// -> success || error
app.post('/code_samples', (req, res) => {
  const { content, feature_id, language_id, source, user_id } = req.body;

  // Validations
  const errors = [];
  if (!content || !feature_id || !language_id || !user_id) {
    errors.push("Missing required data.");
  }

  if (errors.length) {
    return res.status(500).json(errors);
  }

  database.code_samples.push({
    id: database.code_samples.length,
    content: content,
    feature_id: feature_id,
    language_id: language_id,
    source: source,
    user_id: user_id,
    correctness_upvotes: [],
    correctness_downvotes: [],
    design_upvotes: [],
    design_downvotes: [],
    style_upvotes: [],
    style_downvotes: []
  });

  res.json("Success.")
});

// -> code_sample || error
app.get('/code_samples/:id/', (req, res) => {
  const id = parseInt(req.params.id);
  const code_sample = database.code_samples.find(cs => cs.id === id);
  if (code_sample) {
    res.json(code_sample);
  } else {
    res.status(404).json("Not found.");
  }
});

// TODO -> success || error
app.put('/code_samples/:id/', (req, res) => {
  let success = true;
  if (success) {
    res.json("Success.")
  } else {
    res.status(500).json("Server error.")
  }
});

// TODO -> success || error
app.put('/code_samples/:id/', (req, res) => {
  let success = true;
  if (success) {
    res.json("Success.")
  } else {
    res.status(500).json("Server error.")
  }
});

// -> [Feature]
app.get('/features', (req, res) => {
  res.json(database.features);
});

// -> Feature || Error
app.post('/features', (req, res) => {
  const { name } = req.body;
  if (name) {
    const new_feature = {
      id: database.features[database.features.length - 1].id + 1,
      name: name
    }
    database.features.push(new_feature);
    res.json(new_feature);
  } else {
    res.status(400).json("Bad Request.");
  }
})

// -> Feature || Error
app.patch('/features/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const name = req.body.name;
  const feature = database.features.find(f => f.id === id);
  if (id && feature && name) {
    feature.name = name;
    res.json(feature);
  } else {
    res.status(400).json("Bad Request.");
  }
})

// -> Success || Error
app.delete('/features/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const feature = database.features.find(f => f.id === id);
  if (id && feature) {
    const updated_features = database.features.filter(f => f.id !== id);
    database.features = updated_features;
    res.json("Success");
  } else {
    res.status(400).json("Bad Request.");
  }
})

// -> [language]
app.get('/languages', (req, res) => {
  res.json(database.languages);
});

// -> Feature || Error
app.post('/languages', (req, res) => {
  const { name } = req.body;
  if (name) {
    const new_language = {
      id: database.languages[database.languages.length - 1].id + 1,
      name: name
    }
    database.languages.push(new_language);
    res.json(new_language);
  } else {
    res.status(400).json("Bad Request.");
  }
});

// -> Language || Error
app.patch('/languages/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const name = req.body.name;
  const language = database.languages.find(f => f.id === id);
  if (id && language && name) {
    language.name = name;
    res.json(language);
  } else {
    res.status(400).json("Bad Request.");
  }
});

// -> Success || Error
app.delete('/languages/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const language = database.languages.find(f => f.id === id);
  if (id && language) {
    const updated_languages = database.languages.filter(f => f.id !== id);
    database.languages = updated_languages;
    res.json("Success");
  } else {
    res.status(400).json("Bad Request.");
  }
});

// -> User || Error
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  const user = database.users.find(u => u.email == email);
  if (!user) {
    return res.status(404).json("Authentication failed.");
  }
  const hash = user.hash;
  const valid = bcrypt.compareSync(password, hash);
  if (valid) {
    res.json(user);
  } else {
    res.status(404).json("Authentication failed.");
  }
});

// -> User || Error
app.post('/signup', (req, res) => {
  const { email, password, username } = req.body;

  // Validations
  const errors = [];
  if (!email || email.length === 0) {
    errors.push("Invalid email.");
  }
  if (database.users.find(u => u.email === email)) {
    errors.push("Email taken.")
  }
  if (!password || password.length === 0) {
    errors.push("Invalid password.");
  }
  if (!username) {
    errors.push("Missing username.");
  }
  if (database.users.find(u => u.username === username)) {
    errors.push("Username taken.");
  }

  // Response
  if (errors.length === 0) {
    const hash = bcrypt.hashSync(password);
    const user = {
      admin: false,
      email: email,
      hash: hash,
      id: database.users[database.users.length - 1].id + 1,
      moderator: false,
      username: username
    };
    database.users.push(user);
    res.json(user);
  } else {
    res.status(406).send(errors);
  }
});

// Launch
app.listen(port);
