var express        = require('express'),
    methodOverride = require('method-override'),
    bodyParser     = require('body-parser'),
    mongoose       = require('mongoose'),
    port           = process.env.PORT || 8080,
    app            = express();



var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/medtrakr';
mongoose.connect(mongoURI);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('morgan')('dev'));



require('./config/pass.js')(app);
require('./config/auth.js')(app);
require('./routes/passport.js')(app);

app.listen(port, function(){
  console.log('hello world');
});
