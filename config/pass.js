module.exports = function(app, passport, mongoose) {

  //Requiring facebook strategy and the user model
  var FacebookStrategy = require('passport-facebook').Strategy;
  var User             = require('../models/user.js');

  //initializing passport and passport session
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new FacebookStrategy({
   clientID: process.env.MEDTRAKR_FB_SECRET_KEY,
   clientSecret: process.env.MEDTRAKR_FB_SECRET,
   callbackURL: 'http://localhost:8080/login/facebook/return' || 'http://http://medtrakr.herokuapp.com/login/facebook/return',
   profileFields: ['id', 'displayName', 'email'],
   enableProof: true
  },
  function(accessToken, refreshToken, profile, done){
    
     process.nextTick(function() {
         //find user by facebook id, setting to string for unifomrity with the ObjectId of those not logging in with facebook
         User.findOne({ '_id' : String(profile.id) }, function(err, user) {
           //return error if error occurs
           if (err) { return done(err) }
           //if no user found create new user
           if (!user) {
             var newUser = new User();

             newUser._id                        = String(profile.id);
             newUser.firstName                  = profile.displayName.split(' ')[0];
             newUser.lastName                   = profile.displayName.split(' ')[1];
             newUser.email                      = profile.emails[0].value;
             newUser.provider                   = 'facebook';
             newUser.providerData.accessToken   = accessToken;
             newUser.providerData.resfreshToken = refreshToken;

             //save new user
             newUser.save(function(err){
               if (err) {
                 throw err;
                 return done(null, newUser);
               }else {
                   //return created user so that it will redirect to logged in page
                   return done(err, newUser);
               }
              }); //<--newUser.save
           //if user found, return user
           }else { return done(err,user); } //<--if

         }); //<---user findOne
      }) //<--nextTick
    } //<--then function

  )); //<--fb passport middleware

} //<--module exports
