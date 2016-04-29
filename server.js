var express        = require('express'),
    methodOverride = require('method-override'),
    bodyParser     = require('body-parser'),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    port           = process.env.PORT || 8080,
    app            = express();



var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/medtrakr';
mongoose.connect(mongoURI);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('morgan')('dev'));



require('./config/pass.js')(app, passport, mongoose);
require('./config/localStrategy.js')(app, passport, mongoose);
require('./routes/passport.js')(app, passport, mongoose);

app.listen(port, function(){
  console.log('hello world');
});
