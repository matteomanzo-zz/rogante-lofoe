var mongoose = require('mongoose');
var db = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/rogante'
mongoose.connect(db);
console.log('connected to ' + db)
