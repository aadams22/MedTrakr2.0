module.exports = function(app) {
  var passport      = require('passport'),
      LocalStrategy = require('passport-local'),
      mongoose      = require('mongoose'),
      User          = require('../models/user.js');

  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('express-session')({ secret: 'sunny yesterday my life was feelin grey', resave: true, saveUninitialized: true}));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(
    function (username, password, done) {

        User.findOne({username: username}, function (err, user) {

            if (err) return done(err);

            if (!user) return done(null, false, {alert: 'Incorrect username.'});

            if (user.password != password) {
                return done(null, false, {alert: 'Incorrect password.'});
            }
            return done(null, user);
        });
    }

));


app.post('/signup', function(req, res) {

      var user =  new User();

      user.email = req.body.email;
      user.password = req.body.password;
      user.lastName = req.body.lastname;
      user.firstName = req.body.firstname;

      user.save(function(err){
          if (err) {
              res.json({'alert':'Registration error'});
          }else{
              res.json({'alert':'Registration success'});
          }
      });
  });

}
