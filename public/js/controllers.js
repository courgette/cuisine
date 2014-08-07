angular.module('myApp.controllers', []).

controller('globalRecipes', function($scope, $http) {
  $scope.validateRecipes = function() {

    var newRecipes = {},
        ingredientinsert = document.querySelectorAll('.ingredientinsert'),
        globalIngredientsArr = [],
        date = new Date(),
        months = ["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"],
        month = months[date.getMonth()];

    Array.prototype.forEach.call(ingredientinsert, function(el, i){
      var select = el.querySelector('.selectIngredients'),
          valueOption = select.options[select.options.selectedIndex].value,
          nameqte = el.querySelector('input').value,
          seasonValue = select.options[select.options.selectedIndex].dataset.season,
          optionText = select.options[select.options.selectedIndex].textContent,
          selectindice = el.querySelector('.indice'),
          valueOptionIndice = selectindice.options[selectindice.options.selectedIndex].value,
          arrIngredient = [];

        function include(arr,obj) {
          return (arr.indexOf(obj) != -1);
        }

        if(include(seasonValue, month) !== true) {
          alert("Votre ingredient "+optionText+" n'est pas de saison !");
        }

      //arrIngredient.push(valueOption, nameqte);
      globalIngredientsArr.push({
        'id':valueOption,
        'qte':nameqte,
        'indice':valueOptionIndice
      });
    });
    newIngredient = {
      "name":$scope.recipes.name,
      "persons":$scope.recipes.persons,
      "ingredients":globalIngredientsArr
    };
    

    function include(arr,obj) {
      return (arr.indexOf(obj) != -1);
    }

    //$http.post('/recipes', newIngredient);
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
          qte = el.querySelector('.ingredient-qte').value,
          selectindice = el.querySelector('.ingredient-indice');
          valueOptionIndice = selectindice.options[selectindice.options.selectedIndex].value;

      console.log(selectindice);

      var idIngredient = ingredientsList.querySelector('[data-text='+ingredientValue+']').getAttribute('data-id');
      
      globalIngredientsArr.push({
        'id':idIngredient,
        'qte':qte,
        'indice':valueOptionIndice
      });
    });
    upIngredient = {
      "name":$scope.recipe.name,
      "persons":parseFloat($scope.recipe.persons),
      "ingredients":globalIngredientsArr
    };
    $http.put('/recipes/recipe/'+id, upIngredient);
  };
  $scope.deleteRecipe = function(id) {
    if(confirm("Vous êtes sûr de vouloir supprimer cet ingrédient ?") === true) {
      $http.delete('/recipes/recipe/'+id);
      window.location = '#/allrecipes';
    }
  };
}).
controller('menuCtrl', function($scope, $http) {
  var menu = {},
      menuList = document.getElementById('recipes');

  $scope.addMenu = function() {
    menu = {
      "name":$scope.menu.name,
      "lundi":[{
        "id":menuList.querySelector('[data-text="'+$scope.menu.lundi+'"]').getAttribute('data-id'),
        "name":$scope.menu.lundi
      }],
      "mardi":[{
        "id":menuList.querySelector('[data-text="'+$scope.menu.mardi+'"]').getAttribute('data-id'),
        "name":$scope.menu.mardi
      }],
      "mercredi":[{
        "id":menuList.querySelector('[data-text="'+$scope.menu.mercredi+'"]').getAttribute('data-id'),
        "name":$scope.menu.mercredi
      }],
      "jeudi":[{
        "id":menuList.querySelector('[data-text="'+$scope.menu.jeudi+'"]').getAttribute('data-id'),
        "name":$scope.menu.jeudi
      }],
      "vendredi":[{
        "id":menuList.querySelector('[data-text="'+$scope.menu.vendredi+'"]').getAttribute('data-id'),
        "name":$scope.menu.vendredi
      }],
      "samedi":[{
        "id":menuList.querySelector('[data-text="'+$scope.menu.samedi+'"]').getAttribute('data-id'),
        "name":$scope.menu.samedi
      }],
      "dimanche":[{
        "id":menuList.querySelector('[data-text="'+$scope.menu.dimanche+'"]').getAttribute('data-id'),
        "name":$scope.menu.dimanche
      }]
    };
    $http.post('/menus', menu);
  };
}).
controller('oldMenus', function($scope, $http, Restangular, $q){
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
controller('oneMenu', function($scope, $http, $q){
  $http.get($scope.url).
    success(function(data) {
      $scope.menu = data;
      //console.log($scope.recipe.ingredients);
    });
  $scope.supMenu = function(id) {
    if(confirm("Vous êtes sûr de vouloir supprimer ce menu ?") === true) {
      $http.delete('/menus/menu/'+id);
      window.location = '#/oldmenus';
    }
  };
  $scope.getListeCourse = function() {
    var menus = document.querySelectorAll('.menus > td'),
        globalIngredientsArr = [],
        newArray = [],
        paPromise = $q.defer(),
        sums = {},
        indice = {},
        shopList = {};

    console.log($scope.menu.name);
    Array.prototype.forEach.call(menus, function(el, i){
      var id = el.getAttribute('data-id');
      $http.get('/recipes/recipe/'+id).
        success(function(data) {
          
            //console.log(ingredient.id);
            var ingredients = data.ingredients,
                ingredientsArray = [];
            ingredients.forEach(function(ingredient) {
              $http.get('/ingredients/ingredient/'+ingredient.id).
              success(function(data) {
                globalIngredientsArr.push([data.name, ingredient.qte, ingredient.indice]);
              });
              
            });
            paPromise.resolve(globalIngredientsArr);
        });
    });

    setTimeout(function(){
      $scope.$apply(function(){
        paPromise.promise.then(function(data){
          
          data.forEach(function(pair, i) {
            if(pair[2]) {
              indice[pair[0]] = pair[2];
            }else {
              sums[pair[0]] = parseFloat(pair[1]) + (sums[pair[0]] || 0);
            }
            sums[pair[0]] = parseFloat(pair[1]) + (sums[pair[0]] || 0);

          });

          shopList = {
            "name" : 'Liste de course de ' + $scope.menu.name,
            "idmenu" : $scope.menu.id,
            "menuname" : $scope.menu.name,
            "shop" : []
          };

          var results = [];
          for(var key in sums) {
            //shopList.shop.push([key, sums[key]+indice[key]]);
            shopList.shop.push({
              "name":key,
              "qte":sums[key]+indice[key]
            });
          }
          $http.post('/shops', shopList).success(function(data) {
            var upMenu = {
              "name":$scope.menu.name,
              "lundi":[{
                "name":$scope.menu.lundi[0].name,
                "id":$scope.menu.lundi[0].id
              }],
              "mardi":[{
                "name":$scope.menu.mardi[0].name,
                "id":$scope.menu.mardi[0].id
              }],
              "mercredi":[{
                "name":$scope.menu.mercredi[0].name,
                "id":$scope.menu.mercredi[0].id
              }],
              "jeudi":[{
                "name":$scope.menu.jeudi[0].name,
                "id":$scope.menu.jeudi[0].id
              }],
              "vendredi":[{
                "name":$scope.menu.vendredi[0].name,
                "id":$scope.menu.vendredi[0].id
              }],
              "samedi":[{
                "name":$scope.menu.samedi[0].name,
                "id":$scope.menu.samedi[0].id
              }],
              "dimanche":[{
                "name":$scope.menu.dimanche[0].name,
                "id":$scope.menu.dimanche[0].id
              }],
              "id_listshop":data.id
            };
            $http.put('/menus/menu/'+$scope.menu.id, upMenu);
          });
        });
      });
    }, 500);
    
  };
  /*var urlIngredient = document.querySelectorAll('.url-ingredient');

  console.log(urlIngredient);*/
}).
controller('upMenuCtrl', function($scope, $routeParams, $http){
  var id = $routeParams.id,
      upMenu = {},
      menuList = document.getElementById('recipes');
  $http.get('/menus/menu/'+id).
    success(function(data) {
      $scope.menu = data;
    });
  $scope.updateMenu = function() {
    //console.log($scope.menu.lundi[0].name);
    upMenu = {
      "name":$scope.menu.name,
      "lundi":[{
        "id":menuList.querySelector('[data-text="'+$scope.menu.lundi[0].name+'"]').getAttribute('data-id'),
        "name":$scope.menu.lundi[0].name
      }],
      "mardi":[{
        "id":menuList.querySelector('[data-text="'+$scope.menu.mardi[0].name+'"]').getAttribute('data-id'),
        "name":$scope.menu.mardi[0].name
      }],
      "mercredi":[{
        "id":menuList.querySelector('[data-text="'+$scope.menu.mercredi[0].name+'"]').getAttribute('data-id'),
        "name":$scope.menu.mercredi[0].name
      }],
      "jeudi":[{
        "id":menuList.querySelector('[data-text="'+$scope.menu.jeudi[0].name+'"]').getAttribute('data-id'),
        "name":$scope.menu.jeudi[0].name
      }],
      "vendredi":[{
        "id":menuList.querySelector('[data-text="'+$scope.menu.vendredi[0].name+'"]').getAttribute('data-id'),
        "name":$scope.menu.vendredi[0].name
      }],
      "samedi":[{
        "id":menuList.querySelector('[data-text="'+$scope.menu.samedi[0].name+'"]').getAttribute('data-id'),
        "name":$scope.menu.samedi[0].name
      }],
      "dimanche":[{
        "id":menuList.querySelector('[data-text="'+$scope.menu.dimanche[0].name+'"]').getAttribute('data-id'),
        "name":$scope.menu.dimanche[0].name
      }]
    };
    $http.put('/menus/menu/'+id, upMenu);
  };
  $scope.deleteMenu = function(id) {
    if(confirm("Vous êtes sûr de vouloir supprimer ce menu ?") === true) {
      $http.delete('/menus/menu/'+id);
      window.location = '#/oldmenus';
    }
  };
}).
controller('shopList', function($scope, $routeParams, $http){
  var id = $routeParams.id;
  $http.get('/shops/shop/'+id).
    success(function(data) {
      $scope.shop = data;
    });
});