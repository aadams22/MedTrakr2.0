// console.log('pass.js');


module.exports = function(app) {
  var passport      = require('passport'),
      localStrategy = require('passport-local'),
      mongoose      = require('mongoose'),
      Strategy      = require('passport-facebook').Strategy,
      User          = require('../models/user.js');
      app.use(passport.initialize());
      app.use(passport.session());

  passport.use(new Strategy({
   clientID: env.process.FB.KEY,
   clientSecret: env.process.FB.SECRET,
   callbackURL: 'http://localhost:8080/login/facebook/return' || 'http://http://enig-matic.herokuapp.com/login/facebook/return',
   profileFields: ['id', 'displayName', 'email'],
   enableProof: true
  },
  function(accessToken, refreshToken, profile, done){
   // console.log('this is new Strategy user profile: ', profile);
   // console.log('this is the access token: ', accessToken);
   // console.log('this is the refresh token: ', refreshToken);
   // console.log('these are your friends: ', profile._json.friends.data);
   var theAccessToken = accessToken;
   var theRefreshToken = refreshToken;


   User.findOne({ '_id' : profile.id }, function(err, user) {
     console.log('this is find or create user ');


     if (err) {
       console.log("things broke")
       return done(err)
     }
     if (!user) {
       console.log('making new person, no one found');
       var newUser = new User();

       newUser._id                        = profile.id;
       newUser.userProfile.displayName    = profile.displayName;
       newUser.userProfile.email          = profile.emails[0].value;
       newUser.provider                   = 'facebook';
       newUser.providerData.accessToken   = theAccessToken;
       newUser.providerData.resfreshToken = theRefreshToken;


       newUser.save(function(err){
         console.log("THIS USER IS NEW: " + newUser)
         if (err) {
           throw err;
           return done(null, newUser);
         }else {
             console.log("NEW USER SAVED");
             return done(err,user);
           }
       }); //<--newUser.save



     }else {
         User.findOneAndUpdate({ '_id' : profile.id }, { 'friends' : profile._json.friends.data}, function(err, user){
           console.log('THIS IS FOUND AND UPDATED: ', user);
           return done(err,user);
         });

     }

   }); //<---user findOne

  }));




}
