var assert = require('assert'),
    db = require('../db')({namespace:'ingredients-test-db'}),
    the_ingredient = {};


 
require('vows')
.describe('ingredients-db')
.addBatch({
  "Initialize": {
    topic: function () {
      db.deleteAll(this.callback);
    },
    "deleteAll": function (err, placeholder /* required for Vows to detect I want the error to be passed */) {
      assert.isNull(err);
    }
  }
}).addBatch({
  "Creation": {
    topic: function () {
      db.save({
        "name": "Courgette",
        "famille": "fruits et légumes",
        "quantite": "3",
        "saison": "avril, mai, juin"
      }, this.callback);
    },
    "save (new)": function (err, ingredient, created) {
      assert.isNull(err);
      assert.isTrue(created);
      assert.include(ingredient, 'id');
      assert.equal(ingredient.name, 'Courgette');
      assert.equal(ingredient.famille, 'fruits et légumes');
      assert.equal(ingredient.quantite, "3");
      assert.equal(ingredient.saison, 'avril, mai, juin');
      the_ingredient = ingredient;
    }
  }
}).addBatch({
  "Fetch": {
    topic: function () {
      db.fetchOne(the_ingredient.id, this.callback)
    },
    "check existing": function (err, ingredient) {
      assert.isNull(err);
      assert.isObject(ingredient);
      assert.deepEqual(ingredient, the_ingredient);
    }
  }
}).addBatch({
  "Update": {
    topic: function () {
      the_ingredient.title = 'Courgette farcie';
      db.save(the_ingredient, this.callback);
    },
    "save (update)": function (err, ingredient, created) {
      assert.isNull(err);
      assert.isFalse(created);
      assert.equal(ingredient.title, the_ingredient.title);
      assert.equal(ingredient.url, the_ingredient.url);
      assert.deepEqual(ingredient.tags, the_ingredient.tags);
    }
  }
}).addBatch({
  "Delete": {
    topic: function () {
      db.deleteOne(the_ingredient.id, this.callback);
    },
    "Deleted": function (err, deleted) {
      assert.isNull(err);
      assert.isTrue(deleted);
    }
  }
}).addBatch({
  "Finalize": {
    topic: db,
    "Clean": function (db) {
      db.deleteAll();
    },
    "Close connection": function (db) {
      db.close();
    }
  }
}).export(module)