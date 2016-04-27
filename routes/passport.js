console.log("routes/passport.js");
module.exports = function(app) {
  var passport = require('passport');
  var mongoose = require('mongoose');
  app.use(passport.initialize());
  app.use(passport.session());


  //LOGOUT
  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  //FACEBOOK OAUTH
  app.get('/login/facebook',
    passport.authenticate('facebook',  { scope: ['email'] })
  );

  //FACEBOOK OAUTH CALLBACK
  app.get('/login/facebook/return',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req,res){
      res.redirect('/user');
  });

  app.post('/login',
    passport.authenticate('local', { failureRedirect: '/' }),
    function(req,res){
      console.log('login accessed', res);
      res.redirect('/user');
  });

  app.get('/signup',
    passport.authenticate('user', { failureRedirect: '/' }),
    function(req,res){
      console.log('signup accessed', res);

      res.redirect('/');
  });





  //IS LOGGED IN
  function isLoggedIn(req, res, next) {
      if (req.isAuthenticated())
          return next();
         //  console.log('========!!!!!is authenticated!!!!!========')
      res.redirect('/');
  }

}
