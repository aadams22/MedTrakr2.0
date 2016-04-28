module.exports = function(app) {

  var passport         = require('passport'),
      mongoose         = require('mongoose'),
      facebookStrategy = require('passport-facebook').Strategy,
      User             = require('../models/user.js');

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new facebookStrategy({
   clientID: process.env.MEDTRAKR_FB_SECRET_KEY,
   clientSecret: process.env.MEDTRAKR_FB_SECRET,
   callbackURL: 'http://localhost:8080/login/facebook/return' || 'http://http://medtrakr.herokuapp.com/login/facebook/return',
   profileFields: ['id', 'displayName', 'email'],
   enableProof: true
  },
  function(accessToken, refreshToken, profile, done){
   console.log('this is new Strategy user profile: ', profile);
   console.log('this is the access token: ', accessToken);
  //  console.log('this is the refresh token: ', refreshToken);
   var theAccessToken = accessToken;
   var theRefreshToken = refreshToken;
   console.log('this is fb firstname: ', profile.displayName.split(' ')[0]);
   console.log('this is fb lastname: ', profile.displayName.split(' ')[1]);

   User.findOne({ '_id' : profile.id }, function(err, user) {
     console.log('this is find or create user ', user);


     if (err) {
       console.log("things broke");
       return done(err)
     }
     if (user) {
       return done(err,user);
     } else if (!user) {
       console.log('making new person, no one found');
       var newUser = new User();

       newUser._id                        = profile.id;
       newUser.firstName                  = profile.displayName.split(' ')[0];
       newUser.lastName                   = profile.displayName.split(' ')[1];
       newUser.email                      = profile.emails[0].value;
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

     } //<--if

   }); //<---user findOne

  }));


}
