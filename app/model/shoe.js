// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
	_id: Number,
  model: String,
  size: Number,
  colour: String,
  price: Number,
  vendor: String,
  ordered_at: Date,
  closed_at: Date,
  email: String,
  done: Boolean
});

// the schema is useless so far
// we need to create a model using it
var Shoe = mongoose.model('Shoe', userSchema);

// make this available to our users in our Node applications
module.exports = Shoe;
