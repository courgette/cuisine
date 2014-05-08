angular.module('myApp.controllers', []).

controller('hello', function($scope, $http) {
  $http.get('/recipes/recipe/3').
    success(function(data) {
      $scope.recipe = data;
    });
}).

controller('hi', function($scope, $http) {
  $http.get('ingredients/ingredient/'+$scope.t.id).
    success(function(d){
      $scope.ingredient = d;
    });
  $scope.qte = $scope.t.qte;
}).

controller('addRecipesCtrl', function($scope, $http) {
  $scope.validateRecipes = function() {
    console.log('dsqdsq');
    console.log($scope.form);
  };
}).

controller('addIngredientCtrl', function($scope, $http, Restangular) {
  var ingredients = Restangular.all('ingredients');
  var allIngredients = ingredients.getList();

  allIngredients.then(function(ingredient) {

  });


  $scope.validateIngredient = function() {
    var newIngredient = {};
    if($scope.ingredient.season === undefined) {
      newIngredient = {
        name:$scope.ingredient.name,
        family:$scope.ingredient.family
      };
    }else {
      newIngredient = {
        name:$scope.ingredient.name,
        family:$scope.ingredient.family,
        season:$scope.ingredient.season
      };
    }
    ingredients.post(newIngredient);
    console.log(newIngredient);
    //var all = Restangular.all('ingredients');
    
  };
});