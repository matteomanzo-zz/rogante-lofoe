if (process.env.ENV == 'DEVELOPMENT') require('dotenv').config()
var mongoose = require('mongoose');

var db = 'mongodb://localhost:27017/rogante'

if (process.env.ENV == 'PRODUCTION') db = process.env.MONGOLAB_URI

mongoose.connect(db);
console.log('connected to ' + db)