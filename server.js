var express = require('express'),
    app = express();
 
app.configure(function () {
  app.set('views', __dirname + '/views');
  app.use("/partials", express.static(__dirname + "/views/partials"));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
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

// Homepage
app.get('/', function (req, res) {
  res.sendfile('index.html', { root: __dirname + "/views" });
});

/*app.get('/addrecipes', function (req, res) {
  res.sendfile(__dirname + '/views/addrecipes.html');
});*/
 
if (module.parent === null) {
  app.listen(3000);
  //console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}