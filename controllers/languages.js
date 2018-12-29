const languages = {};

// -> [language]
languages.handleGet = (req, res, db) => {
  db("languages")
    .select("*")
    .orderBy("name")
    .then(languages => res.json(languages))
    .catch(err => res.status(400).json("Connection error."));
};

// -> Feature || Error
languages.handlePost = (req, res, db) => {
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
};

// Update language
// -> Feature || Error
languages.handleIdGet = (req, res, db) => {
  const { id } = req.params;
  const { name, syntax_code } = req.body;
  db("languages")
    .where("id", "=", id)
    .update({ name, syntax_code })
    .returning("*")
    .then(feat => res.json(feat[0]))
    .catch(err => res.status(400).json("Server couldn't update language"));
};

// -> Success || Error
languages.handleDelete = (req, res, db) => {
  db("languages")
    .where("id", req.params.id)
    .del()
    .then(response => res.json("Success."))
    .catch(err => res.status(400).json("Server couldn't delete langauge."));
};

module.exports = languages;
