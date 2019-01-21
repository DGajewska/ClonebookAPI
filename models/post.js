const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let postSchema = new Schema ({
  poster: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postContent: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
  likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }]
})

module.exports = mongoose.model('Post', postSchema);
