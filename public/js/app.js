angular.module( 'myApp', [
  'ngRoute',
  'restangular',
  'myApp.controllers',
  'myApp.directives'
]).
config(function(RestangularProvider){
  RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
}).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/home.html'
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
  when('/allrecipes', {
    templateUrl: 'partials/allrecipes.html',
    controller: 'allRecipesCtrl'
  }).
  otherwise({
    redirectTo: '/'
  });
  
}]).
config(function($httpProvider){
  $httpProvider.defaults.headers.post['Content-Type'] ='application/json; charset=UTF-8';
  $httpProvider.defaults.headers.put['Content-Type'] ='application/json; charset=UTF-8';
});
//