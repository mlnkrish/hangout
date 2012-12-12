var mongoose = require('mongoose');
var config = require('../config'); // Local congig file to hide creds
var db = mongoose.connect(config.creds.mongoose_auth);
var Schema = mongoose.Schema; 


var UserSchema = new Schema({
  _id: String,
  name: String,
  first_name : String,
  last_name : String,
  link: String,
  username : String,
  birthday : String,
  gender : String,
  timezone : String,
  locale : String,
  verified : Boolean,
  updated_time: Date,
},{strict : false});


var User = db.model('User', UserSchema); 

exports.Models = User;
