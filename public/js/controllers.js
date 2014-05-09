angular.module('myApp.controllers', []).

controller('addRecipesCtrl', function($scope, $http) {
  $scope.validateRecipes = function() {
    console.log('dsqdsq');
    console.log($scope.form);
  };
}).

controller('addIngredientCtrl', function($scope, $http, Restangular) {
  var ingredients = Restangular.all('ingredients');

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
    //var all = Restangular.all('ingredients');
    
  };
}).
controller('allIngredientCtrl', function($scope, $http, Restangular) {
  var ingredients = Restangular.all('ingredients'),
      listIngredients = ingredients.getList();

  listIngredients.then(function(ArrayIngredient) {
    $scope.ingredients = ArrayIngredient;
    ArrayIngredient.forEach(function(ingredient) {
      $http.get(ingredient).success(function(data){
        $scope.ingredient = data;
      });
    });
  });

}).
controller('getOneIngredient', function($scope, $http){
  $http.get($scope.url).
    success(function(data) {
      $scope.ingredient = data;
    });
  $scope.deleteIngredient = function(id){
    if(confirm("Vous êtes sûr de vouloir supprimer cet ingrédient ?") === true) {
      $http.delete('/ingredients/ingredient/'+id);
      window.location.reload();
    }
  };
  $scope.updateIngredient = function(id) {
    
    var upIngredient = {};
    if($scope.ingredient.season === undefined) {
      upIngredient = {
        name:$scope.ingredient.name,
        family:$scope.ingredient.family
      };
    }else {
      upIngredient = {
        name:$scope.ingredient.name,
        family:$scope.ingredient.family,
        season:$scope.ingredient.season
      };
    }
    $http.put('ingredients/ingredient/'+id, upIngredient);
    window.location.reload();
  };
});