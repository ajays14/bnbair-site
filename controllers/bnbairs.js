const Bnbair = require("../models/places");

module.exports.index = async (req, res) => {
  const bnbairs = await Bnbair.find({});
  res.render("bnbairs/index", { bnbairs });
};

module.exports.renderNewForm = (req, res) => {
  res.render("bnbairs/new");
};

module.exports.createBnbair = async (req, res) => {
  const bnbair = new Bnbair(req.body.bnbair);
  bnbair.author = req.user._id;
  await bnbair.save();
  req.flash("success", "Successfully made a new bnbair!");
  res.redirect(`/bnbairs/${bnbair._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const bnbair = await Bnbair.findById(id);
  if (!bnbair) {
    req.flash("error", "Cannot find that bnbair");
    return res.redirect("/bnbairs");
  }
  res.render("bnbairs/edit", { bnbair });
};

module.exports.updateBnbair = async (req, res) => {
  const { id } = req.params;
  const bnbair = await Bnbair.findByIdAndUpdate(
    id,
    { ...req.body.bnbair },
    { useFindAndModify: false }
  );
  req.flash("success", "Successfully updated bnbair!");
  res.redirect(`/bnbairs/${bnbair._id}`);
};

module.exports.removeBnbair = async (req, res) => {
  const { id } = req.params;
  const bnbair = await Bnbair.findByIdAndDelete(id);
  if (!bnbair) {
    req.flash("error", "Cannot find that bnbair");
    return res.redirect("/bnbairs");
  }

  req.flash("success", "Successfully removed your bnbair listing!");
  res.redirect("/bnbairs");
};

module.exports.showBnbair = async (req, res) => {
  const { id } = req.params;
  const bnbair = await Bnbair.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!bnbair) {
    req.flash("error", "Cannot find that bnbair");
    return res.redirect("/bnbairs");
  }
  res.render("bnbairs/show", { bnbair });
};
