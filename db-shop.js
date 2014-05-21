module.exports = function (options) {
 
  /**
   * Module options
   */
  var client = require('redis').createClient(),
      namespace = 'shops';
  if ('undefined' != typeof options) _set_options_(options);
   
  /**
   * Privates
   */
  // Get shop key name
  function _key_ (id) {
    return namespace + ':' + id + ':json';
  }
  // Get sequence key name
  function _seq_ () {
    return namespace + '::sequence';
  }
  // Update internal options
  function _set_options_ (options) {
    if ('undefined' != typeof options.database)  client.select(options.database);
    if ('undefined' != typeof options.namespace) namespace = options.namespace;
    return this;
  }
   
  return {
   
    /**
     * Update options
     */
    "configure": _set_options_,
   
    /**
     * Allow disconnection
     */
    "close": function disconnect (callback) {
      if (client.connected) client.quit();
      if (callback) client.on('close', callback);
    },

    /**
     * Save a shop
     * if shop has no attribute "id", it's an insertion, else it's an update
     * callback is called with (err, shop, created)
     */
    "save": function save (shop, callback) {
      var created = ('undefined' == typeof shop.id);
      var self = this;
      var onIdReady = function () {
        client.set(_key_(shop.id), JSON.stringify(shop), function (err) {
          callback(err, shop, created);
        });
      }
      if (created) { // No ID: generate one
        client.incr(_seq_(), function (err, id) {
          if (err) return callback(err);
          shop.id = id;
          onIdReady();
        });
      } else { // ID already defined: it's an update
        this.fetchOne(shop.id, function (err, old) {
          if (err) return callback(err);
          for (var attr in shop) {
            old[attr] = shop[attr];
          }
          shop = old;
          onIdReady();
        });
      }
    },
     
    /**
     * Retrieve a shop
     * callback is called with (err, shop)
     * if no shop is found, an error is raised with type=ENOTFOUND
     */
    "fetchOne": function fetchOne (id, callback) {
      client.get(_key_(id), function (err, value) {
        if (!err && !value) err = {"message": "shop not found", "type":"ENOTFOUND"};
        if (err) return callback(err);
        var shop = null;
        try {
          shop = JSON.parse(value);
        } catch (e) {
          return callback(e);
        }
        return callback(undefined, shop);
      });
    },
     
    /**
     * Retrieve all IDs
     * callback is called with (err, shops)
     */
    "fetchAll": function fetchAll (callback) {
      client.keys(_key_('*'), function (err, keys) {
        if (err) return callback(err);
        callback(undefined, keys.map(function (key) {
          return parseInt(key.substring(namespace.length+1));
        }));
      });
    },
     
    /**
     * Delete a shop
     * callback is called with (err, deleted)
     */
    "deleteOne": function deleteOne (id, callback) {
      client.del(_key_(id), function (err, deleted) {
        if (!err && deleted == 0) err = {"message": "shop not found", "type":"ENOTFOUND"};
        callback(err, deleted > 0);
      });
    },
     
    /**
     * Flush the whole shops database
     * Note that it doesn't call "flushAll", so only "shops" entries will be removed
     * callback is called with (err, deleted)
     */
    "deleteAll": function deleteAll (callback) {
      var self = this;
      client.keys(_key_('*'), function (err, keys) {
        if (err) return callback(err);
        var deleteSequence = function deleteSequence (err, deleted) {
          if (err) return callback(err);
          client.del(_seq_(), function (err, seq_deleted) {
            callback(err, deleted > 0 || seq_deleted > 0);
          });
        }
        if (keys.length) {
          client.del(keys, deleteSequence);
        } else {
          deleteSequence(undefined, 0);
        }
      });
    }
   
  };
 
};