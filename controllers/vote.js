const vote = {};

// -> Success || Error
vote.handlePost = (req, res, db) => {
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
};

module.exports = vote;
