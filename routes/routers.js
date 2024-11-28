const { Router } = require("express");
const {
  validateSignUp,
  loggedRedirect,
  checkLogged,
  submitMessage,
  displayMessages,
  deleteMessage,
} = require("../controllers/controllers");
const { passport } = require("../auth/passport");
const router = Router();

router.get("/", loggedRedirect, (req, res) => res.render("index"));

router.get("/login", loggedRedirect, (req, res) =>
  res.render("login", { message: null })
);

router.get("/signup", loggedRedirect, (req, res) =>
  res.render("signup", { errors: null })
);

router.get("/home", checkLogged, displayMessages);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

router.get("/new", checkLogged, (req, res) =>
  res.render("new", { user: req.user })
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
  })
);

router.post("/signup", validateSignUp);
router.post("/new", checkLogged, submitMessage);
router.post("/delete", checkLogged, deleteMessage);

module.exports = { router };
