const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema ({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  dob: { type: Date }
})

module.exports = mongoose.model('User', userSchema);
