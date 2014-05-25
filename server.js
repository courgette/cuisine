var express = require('express'),
    app = express();
 
app.configure(function () {
  app.set('views', __dirname + '/views');
  app.use("/partials", express.static(__dirname + "/views/partials"));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// Asynchronous
var auth = express.basicAuth(function(user, pass, callback) {
 var result = (user === 'test' && pass === 'test');
 callback(null /* error */, result);
});

app.configure('development', function () {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function () {
  app.use(express.errorHandler());
});
 
// Montage de l'API REST sur /ingredients
app.use('/ingredients', app.bookmarks_app = require('./ingredient-rest')());
app.use('/recipes', app.bookmarks_app = require('./recipe-rest')());
app.use('/menus', app.bookmarks_app = require('./menu-rest')());
app.use('/shops', app.bookmarks_app = require('./shop-rest')());

// Homepage
app.get('/', auth, function (req, res) {
  res.sendfile('index.html', { root: __dirname + "/views" });
});

app.get('/noAuth', function(req, res) {
 res.send('No Authentication');
});
 
if (module.parent === null) {
  app.listen(3000);
  //console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}