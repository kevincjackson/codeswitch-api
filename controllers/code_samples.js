const code_samples = {};


// -> [codesample]
code_samples.handleSearch = (req, res, db) => {
  const { feature_ids, language_ids } = req.body;
  db("code_samples")
    .select("*")
    .whereIn("feature_id", feature_ids)
    .whereIn("language_id", language_ids)
    .then(results => res.json(results))
    .catch(err => res.status(400).json("Connection error."));
};


// -> [codesample]
code_samples.handleGet = (req, res, db) => {
  db("code_samples")
    .select("*")
    .then(samples => res.json(samples))
    .catch(err => res.status(400).json("Connection error."));
};


// Create new code sample
// -> success || error
code_samples.handlePost = (req, res, db) => {
  const { content, feature_id, language_id, source, user_id } = req.body;

  // Validations
  if (!content || !feature_id || !language_id || !user_id) {
    return res.status(400).json("Missing fields.");
  }

  db("code_samples")
    .insert({ content, feature_id, language_id, source, user_id })
    .then(data => res.json("Success."))
    .catch(err => res.status(400).json("Couldn't add code sample."));
};


// -> code_sample || error
code_samples.handleIdGet = (req, res, db) => {
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
};



module.exports = code_samples;
