require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const { router } = require("./routes/routers");
const { pool } = require("./database/pool");
const app = express();
const { passport } = require("./auth/passport");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      pool: pool,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(passport.session());

app.use(router);

app.listen(3000);
