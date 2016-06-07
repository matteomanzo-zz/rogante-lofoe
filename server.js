var http = require('http');
var https = require('https');
var express = require('express');
var app = express();
var server = http.createServer(app);
var db = require("./db");
var bodyParser = require('body-parser')
var Shoe = require('./app/model/shoe');
var debug = require('debug')

app.set('view engine', 'ejs');
app.set('views',__dirname + '/app/views');
app.use(express.static(__dirname + '/app/public'));
app.use(bodyParser.text({ type: 'text/html' }));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var addShoeIfMissing = function(shoe) {
  Shoe.findOne({_id: shoe._id}, function (err, object){ 
    if (object) {
      console.log('ID already here!')
    } else {
      shoe.save(function(err){
        if (err) {
          throw(err)
        } else {
          console.log('shoe saved')
        }
      })
    }
  })
}

var isDone = function(shoe) {
  if (shoe.closed_at === null) {
    return false 
  } else {
    return true
  }
}

app.get('/', function(request, response) {

  var req = https.request('https://' + process.env.API_KEY + ':' + process.env.API_PSW + '@muntuch.myshopify.com/admin/orders.json?status=any', 
    function(response) {
      var body = '';
      
      response.on('data', function(d) {
          body += d;
      });

      response.on('end', function() {
        var parsed = JSON.parse(body);
        var data = parsed.orders
        for (i in data) {
          // console.log(data[i].line_items[0].vendor, data[i].shipping_lines[0].source)
          var shoe = new Shoe ({
            _id: data[i].id,
            model: data[i].line_items[0].name,
            size: request.body.size, // not every order on Shopify has an email
            colour: request.body.colour, // not every order on Shopify has a colour
            price: data[i].total_price,
            vendor: data[i].line_items[0].vendor,
            ordered_at: data[i].created_at,
            closed_at: data[i].closed_at,
            email: data[i].email,
            done: isDone(data[i])
          });

          addShoeIfMissing(shoe);
        }
      });
    }
  );
  req.end()

  return Shoe.find({}, function(err, shoes) {
    if (err) throw err;

    response.render('index', {shoes: shoes});
  });
});

var saveShoe = function(shoe) {
  Shoe.count({_id: shoe._id}, function (err, count){ 
    if (count > 0) {
      console.log(shoe._id)
      console.log('id already here')
      shoe._id = Math.floor((Math.random() * 10000000000) + 1);
      return saveShoe(shoe)
    } else {
      console.log(shoe._id)
      return shoe.save(function(err) {
        if (err) {
          throw err;
        } else {
          console.log('shoe saved');
          console.log(shoe)
        }
      });
    }
  });
}


app.post('/orders', function(request, response) {

  var shoe = new Shoe ({
    _id: Math.floor((Math.random() * 10000000000) + 1), 
    model: request.body.model,
    size: request.body.size,
    colour: request.body.colour,
    ordered_at: new Date(),
    done: false
  });
  saveShoe(shoe)

  response.redirect('/');

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

    response.redirect('/');

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
