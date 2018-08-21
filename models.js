const mongoose = require('mongoose');
const uuid = require('uuid');


// Author schema
const authorSchema = mongoose.Schema({
  firstName: 'string',
  lastName: 'string',
  userName: {
    type: 'string',
    unique: true
  }
});

// comment schema
const commentSchema = mongoose.Schema({ content: 'string' });
 
//blogpost schema
const blogPostSchema = mongoose.Schema({
  // _id is assigned by default
  title: 'string',
  content: 'string',
 
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author'},
  comments: [commentSchema],
  created: {type: Date, default: Date.now},
});



blogPostSchema.pre('find', function(next) {
  this.populate('author');
  next();
});

blogPostSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
});

blogPostSchema.virtual('authorName').get(function() {
  if(this.author) {
    return `${this.author.firstName} ${this.author.lastName}`.trim();
 } 
  
});




blogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    comments: this.comments
  };
};



// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.

var Author = mongoose.model('Author', authorSchema);
const Blogposts= mongoose.model('Blogposts', blogPostSchema);
module.exports = { Author, Blogposts };






