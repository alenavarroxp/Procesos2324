const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

//GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "726975145917-mjdr25ibj7t7m4sd3bfol0e1jm6mm8lh.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/google/callback",
      // callbackURL: "https://arquitectura-base-github-5rfb3lj4yq-ew.a.run.app/google/callback" //DESARROLLO
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

//GITHUB
passport.use(
  new GitHubStrategy({
    clientID: "8c88b9dee6960a9943c2",
    clientSecret: "25ee1a62f8aac920eac284c8903e0cdbb24ad4f5",
    callbackURL: "http://localhost:3000/github/callback",
  },
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  })
);
