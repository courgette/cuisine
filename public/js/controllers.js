angular.module('myApp.controllers', []).

controller('globalRecipes', function($scope, $http) {
  $scope.validateRecipes = function() {

    var newRecipes = {};
    /*var form = document.addingredient;
    
    var toto = form.elements['selectingredients'].selectedIndex;
    console.log(form.elements['selectingredients'].options[toto].value);
    console.log('dsqdsq');*/
    //console.log($scope.recipes.name);
    var ingredientinsert = document.querySelectorAll('.ingredientinsert'),
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
      console.log('option : '+valueOption);
      console.log('input : '+nameqte);
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

  /*var lastIngredient = document.getElementById('insertIngredient');
      var clone = lastIngredient.cloneNode(true);

  $scope.insertIngredient = function() {
    lastIngredient.insertAdjacentHTML('afterend', '<div class="newIngredient">'+clone.innerHTML+'</div>');
    console.log(clone.innerHTML);
  };*/
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
  console.log($scope.ingredient.id);

  $http.get('ingredients/ingredient/'+$scope.ingredient.id).
    success(function(data) {
      $scope.ing = data;
      console.log(data);
    });
});