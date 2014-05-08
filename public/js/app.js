angular.module( 'myApp', [
  'ngRoute',
  'restangular',
  'myApp.controllers'
]).
config(function(RestangularProvider){
  RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
}).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/home.html',
    controller: 'hello'
  }).
  when('/addrecipes', {
    templateUrl: 'partials/addrecipes.html',
    controller: 'addRecipesCtrl'
  }).
  when('/addingredient', {
    templateUrl: 'partials/addingredient.html',
    controller: 'addIngredientCtrl'
  }).
  when('/allingredient', {
    templateUrl: 'partials/allingredient.html',
    controller: 'allIngredientCtrl'
  }).
  otherwise({
    redirectTo: '/'
  });
  
}]);
//