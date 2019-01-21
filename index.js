const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');
const Like = require('./models/like');
// const account = require('')

let app = express();

//Configure app for bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Set up port for server to listen on
let port = config.port || 3000;

// Connect to DB
mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useCreateIndex: true })

//API Routes
let router = express.Router();

// Prefix routes with /api/clonebook
app.use('/api/clonebook', router);

//Test route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to my Clonebook API' });
});

//get list of users
router.get('/users', (req, res) => {
  User.find((err, users) => {
    if (err) {
      res.send(err);
    }
    res.json(users);
  });
});

//create new user
router.post('/users/create', (req, res) => {
  var user = new User();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.password = req.body.password;
  user.dob = req.body.dob;

  user.save((err) => {
    if (err){
      res.send(err);
    }
    res.json({ message: 'User created successfully' });
  });
});

//get single user
router.get('/users/:userid', (req, res) => {
  User.findById(req.params.userid, (err, user) => {
    if (err){
      res.send(err);
    }
    res.json(user);
  });
});

//update user details
router.put('/users/update/:userid', (req, res) =>{
  User.findById(req.params.userid, (err, user) => {
    if (err){
      res.send(err);
    }
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.dob = req.body.dob;
    user.save(function(err){
      if (err){
        res.send(err);
      }
      res.json({ message: 'User info successfully updated' });
    });
  });
});

//get posts by user
router.get('/posts/:userid', async (req, res) => {
  Post.
    find({poster: req.params.userid}).
    populate('poster', 'firstName lastName -_id').
    populate({ path: 'comments', select: 'commenter commentContent -_id',
        populate: { path: 'commenter', select: 'firstName lastName -_id' } }).
    populate({ path: 'likes', select: 'user -_id',
        populate: { path: 'user', select: 'firstName lastName -_id'} }).
    exec((err, posts) => {
      if (err){
        res.send(err);
      }
      res.json(posts);
    });
});

//create post
router.post('/posts/create/:userid', (req, res) =>{
  User.findById(req.params.userid, (err, user) => {
    if (err) {
      res.send(err);
    }
    let newPost = new Post();

    newPost.poster = user._id;
    newPost.postContent = req.body.postContent;
    newPost.save((err, post) => {
      if (err){
        res.send(err);
      }
      res.json({ message: 'Post successfully created' });
    });
  });
});

//create Comment
router.post('/comments/create/:userid/:postid', (req, res) => {
  Post.findById(req.params.postid, (err, post) => {
    if (err) {
      res.send(err);
    }
    let newComment = new Comment();

    newComment.commenterId = req.params.userid;
    newComment.postId = post._id;
    newComment.commentContent = req.body.commentContent;
    newComment.save((err, comment) => {
      if (err){
        res.send(err);
      }
      post.comments.push(comment._id);
      post.save(err => {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Comment successfully added' });
      });
    });
  });
});

//create Like
router.post('/likes/create/:userid/:postid', (req, res) => {
  Post.findById(req.params.postid, (err, post) => {
    if (err){
      res.send(err);
    }
    let newLike = new Like();

    newLike.post = post._id;
    newLike.user = req.params.userid;
    newLike.save((err, like) => {
      if (err){
        res.send(err);
      }
      post.likes.push(like._id);
      post.save(err => {
        if (err){
          res.send(err);
        }
        res.json({ message: 'Post like successfully added' });
      });
    });
  });
});

//get Likes
router.get('/likes/:postid', (req, res) => {
  Post.
    findById(req.params.postid).
    select('likes').
    populate({ path: 'likes', select: 'user' }).
    exec((err, likes) => {
      if (err){
        res.send(err);
      }
      res.json(likes);
    });
});

//delete one Like
router.delete('/likes/delete/:userid/:postid', (req, res) => {
  Post.
    findById(req.params.postid).
    select('likes').
    populate({ path: 'likes', select: 'user' }).
    exec((err, post) => {
      if (err){
        res.send(err);
      }
      let likes = post.likes;
      for(var i=0;i<likes.length;i++){
        if(likes[i].user == req.params.userid){
          Like.remove({_id:likes[i]._id}, (err, restaurant) => {
            if (err){
              res.send(err);
            }
          })
          likes.splice(i, 1);
        }
      }
      post.save(err => {
        if (err){
          res.send(err);
        }
        res.json({ message: 'Like successfully deleted' });
      });
    });
  });

//Start server
app.listen(port);
console.log(`Server is listening on port ${port}`);
