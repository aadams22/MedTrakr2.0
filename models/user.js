var mongoose = require('mongoose');
var Schema   = mongoose.Schema;



var userSchema = new Schema({
  _id: {
        type   : String,
        unique : true
        },
  email: {
          type     : String,
          unique   : true,
          required : true
          },
  password:    { type: String },
  displayName: { type: String },
  firstName:   { type: String },
  lastName:    { type: String },
  providerData: {
                 accessToken:  { type: String },
                 refreshToken: { type: String }
                },
  meds: [{
          name: { type: String },
          frequency: {
                      quantityFrequency: { type: Number },
                      timeFrequency: { type: String }
                     },
          directions: { type: String },
          quantity: { type: Number },
          refills: { type: Number },
          pharmacy: { type: String },
          contact: { type: Number },
          taken: { type: Boolean },
          tillNext: { type: Number },
          lastTimeTaken: { type: Number }
        }],
  completedMeds: []

});


var User = mongoose.model('User', userSchema);
module.exports = User;
