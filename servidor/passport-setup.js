const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const GoogleOneTapStrategy =
  require("passport-google-one-tap").GoogleOneTapStrategy;

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
      // callbackURL: "http://localhost:3000/google/callback",
      callbackURL: "https://arquitectura-base-github-5rfb3lj4yq-ew.a.run.app/google/callback" //DESARROLLO
    },
    function (_,_,profile, done) {
      return done(null, profile);
    }
  )
);

//GITHUB
passport.use(
  new GitHubStrategy(
    {
      //LOCAL OAUTH
      // clientID: "8c88b9dee6960a9943c2",
      // clientSecret: "25ee1a62f8aac920eac284c8903e0cdbb24ad4f5",
      // callbackURL: "http://localhost:3000/github/callback",
      //PRODUCIÓN OAUTH
      clientID: "8ca5ad36387754bc027c",
      clientSecret: "652dfc3e55bb7a0ab35bf6928da67433feecca61",
      callbackURL:
        "https://arquitectura-base-github-5rfb3lj4yq-ew.a.run.app/github/callback",
    },
    function (_, _, profile, done) {
      return done(null, profile);
    }
  )
);

//GOOGLE ONE TAP
passport.use(
  new GoogleOneTapStrategy(
    {
      clientID: "726975145917-reol4tr88j6m8a0mqehb0k6sop45mto2.apps.googleusercontent.com", // your google client ID
      clientSecret: "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", // your google client secret
      verifyCsrfToken: false, // whether to validate the csrf token or not
    },
    function (profile, done) {
      return done(null, profile);
    }
  )
);
