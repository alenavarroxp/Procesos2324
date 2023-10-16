const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: "726975145917-mjdr25ibj7t7m4sd3bfol0e1jm6mm8lh.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
