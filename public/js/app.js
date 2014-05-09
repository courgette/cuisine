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
  when('/allingredients', {
    templateUrl: 'partials/allingredients.html',
    controller: 'allIngredientCtrl'
  }).
  otherwise({
    redirectTo: '/'
  });
  
}]).
config(function($httpProvider){
   $httpProvider.defaults.headers.put['Content-Type'] ='application/json; charset=UTF-8';
});
//