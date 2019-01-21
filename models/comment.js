const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let commentSchema = new Schema ({
  commenter: { type: Schema.Types.ObjectId, ref:'User', required: true },
  postId: { type: Schema.Types.ObjectId, ref:'Post', required: true },
  commentContent: { type: String, required: true }
})

module.exports = mongoose.model('Comment', commentSchema);
