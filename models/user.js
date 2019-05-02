var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {type: String, required: true},
  password: {type: string, required: true}
});



module.exports = mongoose.model('User', userSchema);