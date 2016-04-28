module.exports = function(app) {
  var passport      = require('passport'),
      LocalStrategy = require('passport-local'),
      mongoose      = require('mongoose'),
      User          = require('../models/user.js');

  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('express-session')({ secret: 'dearly beloved we are bathered here today to get through this thing called life', resave: true, saveUninitialized: true}));
  app.use(passport.initialize());
  app.use(passport.session());


  passport.use(new LocalStrategy(
    function (email, password, done) {

        User.findOne({ email : email }, function (err, user) {
            console.log(user);
            if (err) {
              console.log(err);
              return done(err);
            }
            if (!user) return done(null, false, {alert: 'Incorrect email.'});

            if (user.password != password) {
                return done(null, false, {alert: 'Incorrect password.'});
            }
            return done(null, user);
        });
    }

  ));

  //LOCAL SIGNUP ROUTE
  app.post('/signup', function(req, res) {
      console.log('this is signup ');
      var user =  new User();

      user.email     = req.body.email;
      user.password  = req.body.password;
      user.lastName  = req.body.lastname;
      user.firstName = req.body.firstname;

      user.save(function(err){
          if (err) {
              console.log(err);
              res.json({ 'alert' : 'Registration error' });
          }else{
              res.json({ 'alert' : 'Registration success' });
              res.redirect('/#/user');
          }
      });

  });

  //LOCAL LOGIN
  app.post('/login',
    passport.authenticate('local', { failureRedirect: '/' }),
    function(req,res){
      console.log('login accessed', res);
      res.json(req.user);
  });


}
