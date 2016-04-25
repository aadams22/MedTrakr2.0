var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var userSchema = new Schema({
  _id: {
        type: Number,
        unique: true
        },
  email: {
          type: String,
          unique: true,
          required: true
          },
  displayName: { type: String },
  providerData: {
              accessToken:  { type: String } ,
              refreshToken: { type: String }
              },
});

var User = mongoose.model('User', userSchema);
module.exports = User;
