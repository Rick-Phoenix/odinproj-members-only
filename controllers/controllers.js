const { body, validationResult } = require("express-validator");
const {
  addUser,
  logMessage,
  fetchMessages,
  removeMessage,
} = require("../database/queries");

exports.validateSignUp = [
  body("username")
    .isLength({ min: 3, max: 24 })
    .withMessage("Username must be between 3 and 24 characters."),
  body("password")
    .isLength({ min: 8, max: 24 })
    .withMessage("Password must be between 8 and 24 characters."),
  body("passconfirm").custom((value, { req }) => {
    if (value !== req.body.password)
      throw new Error("The passwords do not match.");
    else return true;
  }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", { errors: errors.array() });
    } else {
      let tier = "standard";
      if (req.body.secretkey === "lol") tier = "VIP";
      else if (req.body.secretkey === "lmao") tier = "admin";

      const user = {
        username: req.body.username,
        password: req.body.password,
        tier: tier,
      };
      addUser(user);
      res.redirect("/");
    }
  },
];

exports.loggedRedirect = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect("/home");
  else next();
};

exports.checkLogged = (req, res, next) => {
  if (!req.isAuthenticated()) return res.send("Access Denied.");
  else next();
};

exports.submitMessage = (req, res) => {
  logMessage(req.user.id, req.body.message);
  res.redirect("/home");
};

exports.displayMessages = async (req, res) => {
  const messages = await fetchMessages();
  console.log(messages);
  res.render("home", { user: req.user, messages: messages });
};

exports.deleteMessage = (req, res) => {
  removeMessage(req.body.msgid);
  res.redirect("/home");
};
