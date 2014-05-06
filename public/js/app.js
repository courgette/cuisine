angular.module( 'myApp', [
  'ngRoute',
  'myApp.controllers'
]).

config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/home.html',
    controller: 'hello'
  }).
  when('/addrecipes', {
    templateUrl: 'partials/addrecipes.html',
    controller: 'recipesCtrl'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);