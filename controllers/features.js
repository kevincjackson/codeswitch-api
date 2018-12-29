const features = {};

// -> [Feature]
features.handleGet = (req, res, db) => {
  db("features")
    .select("*")
    .orderBy("name")
    .then(features => res.json(features))
    .catch(err => res.status(400).json("Connection error."));
};

// Add new feature.
// -> Feature || Error
features.handlePost = (req, res, db) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json("Bad Request.");
  }
  db("features")
    .insert({ name, description })
    .returning("*")
    .then(feat => res.json(feat[0]))
    .catch(err => res.status(400).json("Server couldn't add feature."));
};

// Update feature.
// -> Feature || Error
features.handleIdGet = (req, res, db) => {
  const { name, description } = req.body;
  db("features")
    .where("id", req.params)
    .update({ name, description })
    .returning("*")
    .then(feat => res.json(feat[0]))
    .catch(err => res.status(400).json("Server couldn't update feature."));
};

// -> Success || Error
features.handleDelete = (req, res, db) => {
  db("features")
    .where("id", req.params.id)
    .del()
    .then(response => res.json("Success."))
    .catch(err => res.status(400).json("Server couldn't delete feature."));
};

module.exports = features;
