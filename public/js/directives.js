angular.module('myApp.directives', []).
directive("ingredientinsert", function ($compile, $templateCache) {
    return {
      restrict: "AE",
      transclude: true,
      templateUrl: 'ingredientinsert',
      link: function (scope, element, attrs, ctrl, $transclude) {
          var template = $templateCache.get('ingredientinsert');
          scope.insertIngredient = function () {
              var clone = $compile(template,$transclude)(scope);
              element.after(clone);
          };
      }
  };
});