module.exports = function(app, passport, mongoose) {

  //Requiring local strategy and the user model
  var LocalStrategy = require('passport-local');
  var User          = require('../models/user.js');

  //Setting up middleware
  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('express-session')({
    secret: 'dearly beloved we are gathered here today to get through this thing called life',
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());


  //Local Strategy authentication
  passport.use(new LocalStrategy(
    function (email, password, done) {

        User.findOne({ email : email }, function (err, user) {
            if (err) { return done(err); }

            if (!user) return done(null, false, {alert: 'Incorrect email.'});

            if (user.password != password) {
                return done(null, false, { alert: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }

  ));


  //LOCAL SIGNUP ROUTE
  app.post('/signup', function(req, res) {
      var user =  new User();

      user._id       = mongoose.Types.ObjectId();
      user.email     = req.body.email;
      user.password  = req.body.password;
      user.lastName  = req.body.lastname;
      user.firstName = req.body.firstname;


        user.save(function(err){
            if (err) {
                res.json({ 'alert' : 'Registration error' });
            }else{
                res.json({ 'alert' : 'Registration success! Please proceed to login.' });
            }
        });



  });

  //LOCAL LOGIN
  app.post('/login',
    passport.authenticate('local', { failureRedirect: '/' }),
    function(req,res){ res.json(req.user);
  });


}
