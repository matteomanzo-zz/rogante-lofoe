var http = require('http');
var https = require('https');
var express = require('express');
var app = express();
var server = http.createServer(app);
var db = require("./db");
var bodyParser = require('body-parser')
var Shoe = require('./app/model/shoe');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.text({ type: 'text/html' }));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(request, response) {
  // get all the users
  Shoe.find({}, function(err, shoes) {
    if (err) throw err;
    response.render('index', {shoes: shoes});
  });
});

app.post('/orders', function(request, response) {

  var shoe = new Shoe ({
    model: request.body.model,
    size: request.body.size,
    colour: request.body.colour,
    ordered_at: new Date(),
    todo: true
  });

  shoe.save(function(err) {
    if (err) {
      throw err;
    } else {
      console.log('shoe saved');
    }
  });

  // get all the users
  Shoe.find({}, function(err, shoes) {
    if (err) throw err;

    // object of all the users
    // console.log(shoes);

    response.render('index', {shoes: shoes});
  });
});

app.post('/delete', function(request, response) {


  Shoe.findById(request.body.Id, function(err, user) {
    if (err) throw err;

    console.log(user);

    user.remove(function(err) {
      if (err) throw err;

      console.log('User successfully deleted!');
    });
  });

  Shoe.find({}, function(err, shoes) {
    if (err) throw err;

    response.redirect('/');
  });

});








app.post('/done', function(request, response) {

  Shoe.findById(request.body.Id, function(err, user) {
    if (err) throw err;

    console.log(user);
  });

  Shoe.find({}, function(err, shoes) {
    if (err) throw err;

    response.render('index', {shoes: shoes});
  });
});

server.listen(9999, function(){
  console.log('Lapi server has started');
});
