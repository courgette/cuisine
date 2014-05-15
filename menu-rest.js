var express = require('express'),
    m = require('./middleware-menu');
 
// Instanciated module
module.exports = function () {
  var app = express();
   
  app.db = require('./db-menu')();
  app.on('close', app.db.close);
   
  app.configure(function () {
    app.param('id', m.checkIdParameter);
    app.use(m.checkRequestHeaders);
    app.use(express.bodyParser());
    app.use(m.handleBodyParserError);
    app.use(m.checkRequestData);
    app.use(express.methodOverride());
    app.use(app.router);
  });
  app.configure('development', function () {
    app.use(m.errorHandler({"stack": true}));
  });
  app.configure('production', function () {
    app.use(m.errorHandler());
  });
/*app.configure('test', function () {
  app.use(m.errorHandler({
    "stack": false, "log": function showNothing(){}
  })
});*/
 
  app.post('/', m.dbAction(app.db, 'save'));
  app.get( '/', m.dbAction(app.db, 'fetchAll', function (ids) {
    return ids.map(function (id) {
      return app.route + (app.route.charAt(app.route.length-1) == '/' ? '' : '/') + 'menu/' + id;
    });
  }));
  app.get( '/menu/:id', m.dbAction(app.db, 'fetchOne'));
  app.put( '/menu/:id', m.dbAction(app.db, 'save'));
  app.del( '/', m.dbAction(app.db, 'deleteAll'));
  app.del( '/menu/:id', m.dbAction(app.db, 'deleteOne'));
  app.all( '/*', function (req, res, next) { next({"code":405, "message":"Method not allowed"}); });
   
  return app;
};
 
// Expose dependencies to avoid duplicate modules
exports.express = express;
exports.middlewares = m;
 
// Start when main module
if (module.parent == null) module.exports().listen(3000);