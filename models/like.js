const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let likeSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'PostLiked', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('Like', likeSchema);
