exports.index = function(req, res){
  res.sendfile(__dirname + '/views/index.html');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.sendfile(__dirname + '/views/partial/'+ name +'.html');
};