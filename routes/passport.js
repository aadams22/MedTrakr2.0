module.exports = function(app) {

  var passport = require('passport');
  var mongoose = require('mongoose');
  var User     = require('../models/user.js');


  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('express-session')({ secret: 'sunny yesterday my life was feelin grey', resave: true, saveUninitialized: true}));
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
      console.log('redirecting because user is logged in with FB');
      res.redirect('/#/user');
  });

  //LOCAL LOGIN
  app.post('/login',
    passport.authenticate('local', { failureRedirect: '/' }),
    function(req,res){
      console.log('login accessed', res);
      res.json(req.user);
  });

  //LOCAL SIGNUP
  app.get('/signup',
    passport.authenticate('user', { failureRedirect: '/' }),
    function(req,res){
      console.log('signup accessed', res);

      res.redirect('/');
  });

  //JSON
  app.get('/json', function(req, res){
    console.log(user.id);
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
      if (req.isAuthenticated())
          return next();
          // console.log('========!!!!!is authenticated!!!!!========')
      res.redirect('/');
  }

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
