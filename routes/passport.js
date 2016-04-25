// console.log("routes/passport.js");
module.exports = function(app) {
  var passport      = require('passport');

  
  //LOGOUT
  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });


  //FACEBOOK OAUTH
  app.get('/login/facebook',
    passport.authenticate('facebook',  { scope: ['user_friends', 'email'] })
  );

  //FACEBOOK OAUTH CALLBACK
  app.get('/login/facebook/return',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req,res){
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
