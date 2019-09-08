var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var db = require("../models");

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(new LocalStrategy(
  // Our user will sign in using an email, rather than a "username"
  {
    usernameField: "email"
  },
  function(email, password, done) {
    // When a user tries to sign in this code runs
    db.User.findOne({
      where: {
        email: email
      }
    }).then(function(dbUser) {
      // If there's no user with the given email
      if (!dbUser) {
        return done(null, false, {
          message: "Incorrect email."
        });
      }
      // If there is a user with the given email, but the password the user gives us is incorrect
      else if (!dbUser.validPassword(password)) {
        return done(null, false, {
          message: "Incorrect password."
        });
      }
      // If none of the above, return the user
      return done(null, dbUser);
    });
  }
));

// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((user, done) => {
	console.log('*** serializeUser called, user: ');
	console.log("Id: " + user.id + " Email: " + user.email); 
	console.log('---------');
	done(null, { id: user.id });
})

// user object attaches to the request as req.user
passport.deserializeUser((user, done) => {
  try {
    console.log('DeserializeUser called')
    db.User.findOne({
      where: {
        id: user.id
      }
    }).then(function (user) {
      console.log("deserialise user: " + user.id);
      done(null, user);
    })
  } catch (e) {
    console.log(e);
  }
});

module.exports = passport;
