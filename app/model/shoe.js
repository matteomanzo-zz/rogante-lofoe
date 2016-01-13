// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  model: String,
  size: Number,
  colour: String,
  ordered_at: Date,
  todo: Boolean
});

// the schema is useless so far
// we need to create a model using it
var Shoe = mongoose.model('Shoe', userSchema);

// make this available to our users in our Node applications
module.exports = Shoe;
