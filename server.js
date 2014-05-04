var express = require('express'),
    app = module.exports = express();
 
app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
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
 
// Homepage
app.get('/', function (req, res) {
  res.render('index', { "title": 'Ingredients' });
});
 
if (module.parent === null) {
  app.listen(3000);
  //console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}