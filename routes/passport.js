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


  function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }


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

  app.put('/createMed', function(req,res) {
    console.log('1. req.body: ', req.body);
    console.log('2. create med accessed ', req.user._id);
    var nextTime = 24;
    var h = 3600000;

    if(req.body.frequency.timeFrequency == 'daily') { nextTime *= h; }
    else if (req.body.frequency.timeFrequency == 'twice daily') { nextTime *= (h/2); }
    else if (req.body.frequency.timeFrequency == 'three times daily') { nextTime *= (h/3); }
    else if(req.body.frequency.timeFrequency == 'four times daily') { nextTime *= (h/4); }
    else if(req.body.frequency.timeFrequency == 'every other day') { nextTime *= (h * 2); };
    console.log('3. time frequency', typeof nextTime);
    var newMed = {
                  'name':       capitalizeFirstLetter(req.body.name),
                  'frequency': {
                              'quantityFrequency': parseInt(req.body.frequency.quantityFrequency),
                              'timeFrequency': req.body.frequency.timeFrequency
                              },
                  'directions': capitalizeFirstLetter(req.body.directions),
                  'quantity':   parseInt(req.body.quantity),
                  'refills':    parseInt(req.body.refills),
                  'pharmacy':   capitalizeFirstLetter(req.body.pharmacy),
                  'contact':    parseInt(req.body.contact),
                  'taken':      false,
                  'tillNext':   nextTime,
                  'lastTimeTaken': 0
                }
    User.findByIdAndUpdate(
          req.user._id,
          { $push: { 'meds' : newMed } },
          { safe: true, upsert: true, new: true },
          function(err, data){
          if( err ) console.log(err);
    });
  });


  app.put('/createCompletedMed', function(req,res){
    console.log('=======createCompletedMed accessed:========', req.body);
    User.findByIdAndUpdate(
          req.user._id,
          { $push: { 'completedMeds':  req.body } },
          { safe: true, upsert: true, new: true },
          function(err, data){
          if( err ) console.log(err);
    });

    User.findByIdAndUpdate(
          req.user._id,
          { $unset: { 'meds' : { 'name' : req.body.name } } },
          function(err, data){
          console.log('=======saved=======', data);
          if( err ) console.log(err);
    });

  });


  app.put('/takenMed', function(req,res){
    console.log('=====++++takenMed++++=====', req.body);
    console.log('=====++++lastTimeTake: ', req.body.lastTimeTaken);

    User.findOne({ _id : req.user._id, "meds._id" : req.body._id }, function(err,data) {
      console.log(data);
      if( err ) console.log(err);
      var subDocument = data.meds.id(req.body._id);
      subDocument.taken = true;
      console.log(subDocument);

      data.save(function(err) {
        if( err ) console.log(err);
      });
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
