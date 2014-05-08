/**
* Module dependencies
*/

var contracts = require('contracts');

require('./response'); // Monkey patch

/**
* Options:
* - stack: show stack in error message ?
* - log: logging function
*/
exports.errorHandler = function (options) {
  var log = options.log || console.error,
  stack = options.stack || false;
  return function (err, req, res, next) {
    log(err.message);
    if (err.stack) log(err.stack);
    var content = err.message;
    if (stack && err.stack) content += '\n' + err.stack;
    var code = err.code || (err.type == 'ENOTFOUND' ? 404 : 500);
    res.respond(content, code);
  };
};

/**
* Checks Accept and Content-Type headers
*/
exports.checkRequestHeaders = function (req, res, next) {
  if (!req.accepts('application/json'))
    return res.respond('You must accept content-type application/json', 406);
  if ((req.method == 'PUT' || req.method == 'POST') && req.header('content-type') != 'application/json; charset=UTF-8')
    return res.respond('You must declare your content-type as application/json', 406);
  return next();
};

/**
* Validates recipe
*/
exports.checkRequestData = function (req, res, next) {
  if (req.method == 'POST' || req.method == 'PUT') {
// Body expected for those methods
if (!req.body) return res.respond('Data expected', 400);
var required = req.method == 'POST'; // PUT = partial objects allowed
// Validate JSON schema against our object
var report = contracts.validate(req.body, {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "name": { "type": "string", "required": required },
    "persons": { "type": "number", "required": required },
    "ingredients": {
      "type": "array",
      "items": {
        "type":"object",
        "ingredient": {
          "id": {
            "type":"number"
          },
          "qte": {
            "type": "number"
          }
        }
      }, "required": required
    }
  }
});

/*
"ingredients": { 
      "type": "array", 
      "items": { 
        "type": "number" 
      }, "required": required }
*/
// Respond with 400 and detailed errors if applicable
if (report.errors.length > 0) {
  return res.respond('Invalid data: ' + report.errors.map(function (error) {
    var message = error.message;
    if (~error.uri.indexOf('/')) {
      message += ' (' + error.uri.substring(error.uri.indexOf('/')+1) + ')';
    }
    return message;
  }).join(', ') + '.', 400);
}
}
next();
};

/**
* Catch and transform bodyParser SyntaxError
*/
exports.handleBodyParserError = function (err, req, res, next) {
  if (err instanceof SyntaxError) res.respond(err, 400);
  else next(err);
};

/**
* Work on parameter "id", depending on method
*/
exports.checkIdParameter = function (req, res, next, id) {
  if (isNaN(parseInt(id))) {
    return next({"message": "ID must be a valid integer", "code": 400});
  }
// Update
if (req.method == 'PUT') {
  if ('undefined' == typeof req.body.id) {
req.body.id = req.param('id'); // Undefined, use URL
} else if (req.body.id != req.param('id')) {
return next({"message": "Invalid recipe ID", "code": 400}); // Defined, and inconsistent with URL
}
}
// Create
if (req.method == 'POST') {
  if ('undefined' != typeof req.body.id) {
    return next({"message": "recipe ID must not be defined", "code": 400});
  }
}
// Everything went OK
next();
};

/**
* Middleware defining an action on DB
* @param action The action ("save", "deleteOne", "fetchAll", etc...)
* @param filter An optional filter to be applied on DB result
* @return Connect middleware
*/
exports.dbAction = function (db, action, filter) {
// Default filter = identity
filter = filter || function (v) { return v; };
return function (req, res, next) {
  var params = [];
// Parameters depend of DB action
switch (action) {
  case 'save': params.push(req.body); break;
  case 'fetchOne':
  case 'deleteOne': params.push(req.param('id')); break;
}
// Last parameter is the standard response
params.push(function (err, result) {
  err ? next(err) : res.respond(filter(result));
});
// Execute DB action
db[action].apply(db, params);
}
}