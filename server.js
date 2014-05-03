require('./response');

var express = require('express'),
    routes = require('./routes'),
    db = exports.db = require('./db')(),
    app = module.exports = express();

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));         // set the static files location /public/img will be /img for users
    app.use(express.logger('dev'));                         // log every request to the console
    app.use(express.bodyParser());                          // pull information from html in POST
    app.use(express.methodOverride());                      // simulate DELETE and PUT
});

app.listen(3000);

app.get('/', routes.index);

app.post('/ingredients', function (req, res) {
  if ('undefined' != typeof req.body.id) {
    res.respond(new Error('ingredient ID must not be defined'), 400);
  } else {
    db.save(req.body, function (err, ingredient, created) {
      res.respond(err || ingredient, err ? 500 : 200);
    });
  }
});

app.get('/ingredients', function (req, res) {
  db.fetchAll(function (err, ids) {
    res.respond(err || ids.map(function (id) {
      return '/ingredients/ingredient/' + id;
    }), err ? 500 : 200);
  });
});

app.get('/ingredients/ingredient/:id', function (req, res) {
  if (isNaN(parseInt(req.param('id')))) {
    res.respond(new Error('ID must be a valid integer'), 400);
  }
  db.fetchOne(req.param('id'), function (err, ingredient) {
    if (err) {
      if (err.type == 'ENOTFOUND') res.respond(err, 404);
      else res.respond(err, 500);
    } else res.respond(ingredient, 200);
  });
});

app.put('/ingredients/ingredient/:id', function (req, res) {
  var id = req.param('id');
  if (isNaN(parseInt(req.param('id')))) {
    res.respond(new Error('ID must be a valid integer'), 400);
  } else if ('undefined' != typeof req.body.id && req.body.id != id) {
    res.respond(new Error('Invalid ingredient ID'), 400);
  } else {
    req.body.id = id;
    db.save(req.body, function (err, ingredient, created) {
      if (err) {
        if (err.type == 'ENOTFOUND') res.respond(err, 404);
        else res.respond(err, 500);
      } else res.respond(ingredient, 200);
    })
  }
});

app.del('/ingredients', function (req, res) {
  db.deleteAll(function (err, deleted) {
    res.respond(err || deleted, err ? 500 : 200);
  });
});

app.del('/ingredients/ingredient/:id', function (req, res) {
  var id = req.param('id');
  if (isNaN(parseInt(req.param('id')))) {
    res.respond(new Error('ID must be a valid integer'), 400);
  } else {
    db.deleteOne(id, function (err, deleted) {
      if (err) {
        if (err.type == 'ENOTFOUND') res.respond(err, 404);
        else res.respond(err, 500);
      } else res.respond(deleted, 200);
    });
  }
});

app.all('/ingredients/?*', function (req, res) {
  res.respond(405);
});

app.on('close', db.close); // Close open DB connection when server exits