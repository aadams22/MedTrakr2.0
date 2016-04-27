
module.exports = function(app) {

  var passport      = require('passport'),
      localStrategy = require('passport-local'),
      mongoose      = require('mongoose'),
      Strategy      = require('passport-facebook').Strategy,
      User          = require('../models/user.js');
      app.use(passport.initialize());
      app.use(passport.session());

  passport.serializeUser(function(user, done) {
    console.log('PASSPORT SERIALIZEUSER: ', user.id);
     done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
     console.log('PASSPORT DE-SERIALIZEUSER: ', id);
     User.findById(id, function(err, user) {
       console.log('PASSPORT DE-SERIALIZEUER user ', user);
         done(err, user);
     });
  });
  
}
