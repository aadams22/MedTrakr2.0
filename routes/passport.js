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



  //LOGOUT
  app.get('/logout', function(req, res) {
      console.log("--is logged out--");
      req.logout();
      res.redirect('/');
  });

  app.post('/createMed', function(req,res) {
    console.log('1. req.body: ', req.body);
    console.log('2. create med accessed ', req.user);
    var newMed = {
                  name:       req.body.name,
                  frequency: {
                              quantityFrequency: req.body.frequency.quantityFrequency,
                              timeFrequency: req.body.frequency.timeFrequency
                              },
                  directions: req.body.directions,
                  quantity:   req.body.quantity,
                  refills:    req.body.refills,
                  pharmacy:   req.body.pharmacy,
                  contact:    req.body.contact
                }
    console.log('3. newMed: ', newMed)
    User.findByIdAndUpdate(req.user._id, { $push: {meds: newMed} }, {safe: true, upsert: true}, function(err, data){
      console.log('4.. found data: ', data);


      if( err )console.log(err);
    });
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

  //JSON
  app.get('/json', function(req, res){
    User.findById(req.user.id, function(err, data){
      res.send(data);
    });
  });


} //<--module exports
