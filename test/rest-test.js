const PORT = 3000;
var assert = require('assert'),
    app = require('../server'),
    ingredient = {
      "name": "Courgette",
      "famille": "fruits et légumes",
      "quantite": 3,
      "saison": "avril, mai, juin"
    },
    expected_id = 1;
 
// Configure REST API host & URL
require('api-easy')
.describe('ingredients-db')
.use('localhost', PORT)
.root('/ingredients')
.setHeader('Content-Type', 'application/json')
.setHeader('Accept', 'application/json')
 
// Initially: start server
.expect('Start server', function () {
  app.db.configure({namespace: 'ingredients-test-db'});
  app.listen(PORT);
}).next()
 
// 1. Empty database
.del()
.expect(200)
.next()
 
// 2. Add a new ingredient
.post(ingredient)
.expect('Has ID', function (err, res, body) {
  var obj;
  assert.doesNotThrow(function() { obj = JSON.parse(body) }, SyntaxError);
  assert.isObject(obj);
  assert.include(obj, 'id');
  assert.equal(expected_id, obj.id);
  ingredient.id = obj.id;
})
.undiscuss().next()
 
// 3.1. Check that the freshly created ingredient appears
.get()
.expect('Collection', function (err, res, body) {
  var obj;
  assert.doesNotThrow(function() { obj = JSON.parse(body) }, SyntaxError);
  assert.isArray(obj);
  assert.include(obj, '/ingredients/ingredient/' + expected_id);
})
 
// 3.2. Get the freshly created ingredient
.get('/ingredient/' + expected_id)
.expect('Found ingredient', function (err, res, body) {
  var obj;
  assert.doesNotThrow(function() { obj = JSON.parse(body) }, SyntaxError);
  assert.deepEqual(obj, ingredient);
})
.next()
 
// 4. Update ingredient
.put('/ingredient/' + expected_id, {"name": "Courgette farcie"})
.expect('Updated ingredient', function (err, res, body) {
  var obj;
  assert.doesNotThrow(function() { obj = JSON.parse(body) }, SyntaxError);
  ingredient.title = "Courgette farcie";
  assert.deepEqual(obj, ingredient);
})
.next()
 
// 5. Delete ingredient
.del('/ingredient/' + expected_id)
.expect(200)
.next()
 
// 6. Check deletion
.get('/ingredient/' + expected_id)
.expect(404)
.next()
 
// 7. Check all ingredients are gone
.get()
.expect('Empty database', function (err, res, body) {
  var obj;
  assert.doesNotThrow(function() { obj = JSON.parse(body) }, SyntaxError);
  assert.isArray(obj);
  assert.equal(obj.length, 0);
})
 
// 8. Test unallowed methods
.post('/ingredient/' + expected_id).expect(405)
.put().expect(405)
 
// Finally: clean, and stop server
.expect('Clean & exit', function () {
  app.db.deleteAll(function () {
    app.close();
  });
})
 
// Export tests for Vows
.export(module)