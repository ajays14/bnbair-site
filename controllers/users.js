import User from "../models/user";

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash("success", "Successfully logged out");
  res.redirect("/bnbairs");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to BnbAirs!");
      res.redirect("/bnbairs");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = req.session.returnTo || "/bnbairs";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};
