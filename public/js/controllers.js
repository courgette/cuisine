angular.module('myApp.controllers', []).

controller('globalRecipes', function($scope, $http) {
  $scope.validateRecipes = function() {

    var newRecipes = {},
        ingredientinsert = document.querySelectorAll('.ingredientinsert'),
        globalIngredientsArr = [];

    Array.prototype.forEach.call(ingredientinsert, function(el, i){
      var select = el.querySelector('select'),
          valueOption = select.options[select.options.selectedIndex].value,
          nameqte = el.querySelector('input').value,
          arrIngredient = [];

      //arrIngredient.push(valueOption, nameqte);
      globalIngredientsArr.push({
        'id':valueOption,
        'qte':nameqte
      });
    });
    newIngredient = {
      "name":$scope.recipes.name,
      "persons":$scope.recipes.persons,
      "ingredients":globalIngredientsArr
    };
    
    $http.post('/recipes', newIngredient);
  };
  var hideElement = document.getElementById('addNewIngredient');
  $scope.showAddIngredient = function() {
    if(hideElement.classList.contains('dnone')) {
      hideElement.classList.remove('dnone');
    }else {
      hideElement.classList.add('dnone');
    }
  };
}).

controller('addRecipesCtrl', function($scope, $http) {
  $http.get('/ingredients')
    .success(function(ArrayIngredient) {
      $scope.ingredients = ArrayIngredient;
      ArrayIngredient.forEach(function(ingredient) {
        $http.get(ingredient).success(function(data){
          $scope.ingredient = data;
        });
      });
    });
  
}).

controller('OneIngredient', function($scope, $http) {
  $http.get($scope.url).
    success(function(data) {
      $scope.ingredient = data;
    });
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
    window.location.reload();
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
}).
controller('allRecipesCtrl', function($scope, $http, Restangular){
  var recipes = Restangular.all('recipes'),
      listRecipes = recipes.getList();

  listRecipes.then(function(ArrayRecipes) {
    $scope.recipes = ArrayRecipes;
    ArrayRecipes.forEach(function(recipes) {
      $http.get(recipes).success(function(data){
        $scope.recipe = data;
      });
    });
  });
}).
controller('getOneRecipe', function($scope, $http){
  $http.get($scope.url).
    success(function(data) {
      $scope.recipe = data;
      $scope.recipe.ingredients.forEach(function(ingredient) {
        console.log(ingredient.id);
        $http.get('ingredients/ingredient/'+ingredient.id).success(function(data){
          $scope.ing = data;
        });
      });
      //console.log($scope.recipe.ingredients);
    });
  /*var urlIngredient = document.querySelectorAll('.url-ingredient');

  console.log(urlIngredient);*/
}).
controller('getIngredient', function($scope, $http){

  $http.get('ingredients/ingredient/'+$scope.ingredient.id).
    success(function(data) {
      $scope.ing = data;
    });
}).
controller('upRecipesCtrl', function($scope, $routeParams, $http){
  var id = $routeParams.id,
      upIngredient = {};
  $http.get('/recipes/recipe/'+id).
    success(function(data) {
      $scope.recipe = data;
    });
  $scope.updateRecipe = function() {
    var ingredientcontainer = document.querySelectorAll('.container-ingredient'),
        globalIngredientsArr = [],
        ingredientsList = document.getElementById('ingredients');

    Array.prototype.forEach.call(ingredientcontainer, function(el, i){
      var ingredients = el.querySelector('.ingredient-recipe').getAttribute('data-id'),
          ingredientValue= el.querySelector('.ingredient-recipe').value,
          qte = el.querySelector('.ingredient-qte').value;

      var idIngredient = ingredientsList.querySelector('[data-text='+ingredientValue+']').getAttribute('data-id');

      globalIngredientsArr.push({
        'id':idIngredient,
        'qte':qte
      });
    });
    upIngredient = {
      "name":$scope.recipe.name,
      "persons":parseFloat($scope.recipe.persons),
      "ingredients":globalIngredientsArr
    };
    $http.put('/recipes/recipe/'+id, upIngredient);
    console.log(upIngredient);
  };
  $scope.deleteRecipe = function(id) {
    if(confirm("Vous êtes sûr de vouloir supprimer cet ingrédient ?") === true) {
      $http.delete('/recipes/recipe/'+id);
      window.location = '#/allrecipes';
    }
  };
}).
controller('menuCtrl', function($scope, $http) {
  var menu = {};
  $scope.addMenu = function() {
    menu = {
      "name":$scope.menu.name,
      "lundi":$scope.menu.lundi,
      "mardi":$scope.menu.mardi,
      "mercredi":$scope.menu.mercredi,
      "jeudi":$scope.menu.jeudi,
      "vendredi":$scope.menu.vendredi,
      "samedi":$scope.menu.samedi,
      "dimanche":$scope.menu.dimanche
    };
    $http.post('/menus', menu);
  };
}).
controller('oldMenus', function($scope, $http, Restangular){
  var menus = Restangular.all('menus'),
      listMenus = menus.getList();

  listMenus.then(function(ArrayMenus) {
    $scope.menus = ArrayMenus;
    ArrayMenus.forEach(function(menus) {
      $http.get(menus).success(function(data){
        $scope.menu = data;
      });
    });
  });
}).
controller('oneMenu', function($scope, $http){
  $http.get($scope.url).
    success(function(data) {
      $scope.menu = data;
      //console.log($scope.recipe.ingredients);
    });
  /*var urlIngredient = document.querySelectorAll('.url-ingredient');

  console.log(urlIngredient);*/
});