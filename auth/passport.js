const passport = require("passport");
const { pool } = require("../database/pool");
const { fetchUser, fetchUserById } = require("../database/queries");
const { checkPassword } = require("./passwordUtils");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async function (username, password, done) {
    const user = await fetchUser(username);

    if (!user) {
      return done(null, false, { message: "User does not exist." });
    }

    const isValid = checkPassword(password, user.hash, user.salt);

    if (!isValid) return done(null, false, { message: "Incorrect password." });
    else return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, { username: user.username, tier: user.tier, id: user.id });
});

passport.deserializeUser(async (serializedUser, done) => {
  const userData = await fetchUser(serializedUser.username);
  if (!userData) return done(null, false);
  const user = {
    id: userData.id,
    username: userData.username,
    tier: userData.tier,
  };
  return done(null, user);
});

module.exports = { passport };
