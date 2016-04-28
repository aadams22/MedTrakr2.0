module.exports = function(app, passport, mongoose) {

  //requiring user model
  var User     = require('../models/user.js');

  //setting up middleware for routes: body-parser, session, passport
  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('express-session')({
    secret: 'dearly beloved we are bathered here today to get through this thing called life',
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());



  //FACEBOOK OAUTH
  app.get('/login/facebook',
    passport.authenticate('facebook',  { scope: ['email'] })
  );

  //FACEBOOK OAUTH CALLBACK
  app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req,res){
      res.redirect('/#/user');
  });

  //JSON
  app.get('/json', function(req, res){
    User.findById(user.id, function(err, data){
      res.send(data);
    });
  });

  //LOGOUT
  app.get('/logout', function(req, res) {
      console.log("--is logged out--");
      req.logout();
      res.redirect('/');
  });


  //=============================================================
  //IS LOGGED IN
  function isLoggedIn(req, res, next) {
      if (req.isAuthenticated()) return next();
      res.redirect('/');
  }

  passport.serializeUser(function(user, done) {
     done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
     User.findById(id, function(err, user) {
         done(err, user);
     });
  });




} //<--module exports
