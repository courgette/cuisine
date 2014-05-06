angular.module('myApp.controllers', []).

controller('hello', function($scope, $http) {
  $http.get('/recipes/recipe/1').
    success(function(data) {
      $scope.recipe = data;
    });
}).

controller('hi', function($scope, $http) {
  $http.get('ingredients/ingredient/'+$scope.t).
    success(function(d){
      console.log(d);
      $scope.ingredient = d;
    });
}).

controller('recipesCtrl', ['$scope', function($scope) {
  console.log('teste');
}]);