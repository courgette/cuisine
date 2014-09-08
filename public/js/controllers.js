/* ==========================================================================
   Sommaire

   1 = Add a new Recipes
   2 = Get listing ingredients
   3 = Get one ingredient
   4 = Add a new Ingredient
   5 = Get list ingredients
   6 = Update ingredient
   7 = Get list recipes
   8 = Get one recipe
   9 = Get one ingredient
   10 = Update one Recipe
   11 = Post a Menu Week
   12 = Get List Menus week
   13 = Update a Menu Week

   ========================================================================== */

angular.module('myApp.controllers', ['myApp.factory']).

/* ==========================================================================
   1 = Add a new Recipes
   ========================================================================== */

controller('globalRecipes', function($scope, $http, globalFunction) {
  $scope.validateRecipes = function() {

    //init variables
    var newRecipe = {},
        ingredientinsert = document.querySelectorAll('.ingredientinsert'),
        globalIngredientsArr = [],
        date = new Date(),
        months = ["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"],
        month = months[date.getMonth()];

    // For each ingredients
    Array.prototype.forEach.call(ingredientinsert, function(el, i){

      //init variables
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

          //Check season for each ingredient and alert the user
          if(include(seasonValue, month) !== true && seasonValue !== '') {
            alert("Votre ingredient "+optionText+" n'est pas de saison !");
          }

      //Create a object globalIngredient
      globalIngredientsArr.push({
        'id':valueOption,
        'qte':nameqte,
        'indice':valueOptionIndice
      });
    });

    //Create a new Recipe object
    newRecipe = {
      "name":$scope.recipes.name,
      "persons":$scope.recipes.persons,
      "ingredients":globalIngredientsArr
    };

    //Post the new Recipe
    
    $http
      .post('/recipes', newRecipe)
      .success(function() {
        globalFunction.setMessage('Votre recette a bien été enregistrée', 'success');
      })
      .error(function() {
        globalFunction.setMessage('Merci de remplir tous les champs', 'warning');
      });
  };

  //Add a new Ingredient
  var hideElement = document.getElementById('addNewIngredient');
  $scope.showAddIngredient = function() {
    if(hideElement.classList.contains('dnone')) {
      hideElement.classList.remove('dnone');
    }else {
      hideElement.classList.add('dnone');
    }
  };
}).

/* ==========================================================================
    2 = Get listing ingredients
   ========================================================================== */

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

/* ==========================================================================
    3 = Get one ingredient
   ========================================================================== */

controller('OneIngredient', function($scope, $http) {
  $http.get($scope.url).
    success(function(data) {
      $scope.ingredient = data;
    });
}).

/* ==========================================================================
   4 = Add a new Ingredient
   ========================================================================== */

controller('addIngredientCtrl', function($scope, $http, globalFunction) {

  var newIngredient = {};
  $scope.validateIngredient = function() {
    
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
    //Post new Ingredient
    $http.post('/ingredients', newIngredient)
    .success(function() {
      globalFunction.setMessage('Votre ingrédient a bien été enregistré', 'success');
    })
    .error(function() {
      globalFunction.setMessage('Merci de remplir tous les champs', 'warning');
    });
  };
}).

/* ==========================================================================
   5 = Get list ingredients
   ========================================================================== */

controller('allIngredientCtrl', function($scope, $http) {
  //console.log('allIngredient');

  $http.get('ingredients/').
    success(function(ingredientsUrl) {
      for(var url in ingredientsUrl) {
        $scope.ingredients = [];
        $http.get(ingredientsUrl[url]).success(function(data){
          $scope.ingredients.push(data);
        })
      }
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

/* ==========================================================================
   6 = Update Ingredient
   ========================================================================== */

controller('getOneIngredient', function($scope, $http){
  //console.log($scope.url);
  $http.get($scope.url).
    success(function(data) {
      $scope.ingredient = data;
    });
  
}).

/* ==========================================================================
   7 = Get list recipes
   ========================================================================== */

controller('allRecipesCtrl', function($scope, $http){
  $http.get('recipes/').
    success(function(recipesUrl) {
      for(var url in recipesUrl) {
        $scope.recipes = [];
        $http.get(recipesUrl[url]).success(function(data){
          $scope.recipes.push(data);
        })
      }
    });
}).

/* ==========================================================================
   8 = Get one recipe
   ========================================================================== */

controller('getOneRecipe', function($scope, $http){
  $http.get($scope.url).
    success(function(data) {
      $scope.recipe = data;
    });
}).

/* ==========================================================================
   9 = Get one ingredient
   ========================================================================== */

controller('getIngredient', function($scope, $http){
  $http.get('ingredients/ingredient/'+$scope.ingredient.id).
    success(function(data) {
      $scope.ing = data;
    });
}).

/* ==========================================================================
   10 = Update one Recipe
   ========================================================================== */

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

      //console.log(selectindice);

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

/* ==========================================================================
   11 = Post a Menu Week
   ========================================================================== */

controller('menuCtrl', function($scope, $http, globalFunction) {
  var menu = {
      "name":'',
      "lundi":[],
      "mardi":[],
      "mercredi":[],
      "jeudi":[],
      "vendredi":[],
      "samedi":[],
      "dimanche":[]
      },
      menuList = document.getElementById('recipes');

  $scope.addMenu = function() {
    menu.name = $scope.menu.name;
    if(typeof $scope.menu.lundi !== "undefined") {
      if(typeof $scope.menu.lundi.midi !== "undefined") {
        var lundiMidi = {
          "id":menuList.querySelector('[data-text="'+$scope.menu.lundi.midi+'"]').getAttribute('data-id'),
          "name":$scope.menu.lundi.midi
        };
        menu.lundi.splice(0, 1, lundiMidi);
      }
      if(typeof $scope.menu.lundi.soir !== "undefined") {
        var lundiSoir = {
          "id":menuList.querySelector('[data-text="'+$scope.menu.lundi.soir+'"]').getAttribute('data-id'),
          "name":$scope.menu.lundi.soir
        };
        menu.lundi.splice(1, 1, lundiSoir);
      }
    }
    if(typeof $scope.menu.mardi !== "undefined") {
      if(typeof $scope.menu.mardi.midi !== "undefined") {
        var mardiMidi = {
          "id":menuList.querySelector('[data-text="'+$scope.menu.mardi.midi+'"]').getAttribute('data-id'),
          "name":$scope.menu.mardi.midi
        };
        menu.mardi.splice(0, 1, mardiMidi);
      }
      if(typeof $scope.menu.mardi.soir !== "undefined") {
        var mardiSoir = {
          "id":menuList.querySelector('[data-text="'+$scope.menu.mardi.soir+'"]').getAttribute('data-id'),
          "name":$scope.menu.mardi.soir
        };
        menu.mardi.splice(1, 1, mardiSoir);
      }
    }
    if(typeof $scope.menu.mercredi !== "undefined") {
      if(typeof $scope.menu.mercredi.midi !== "undefined") {
        var mercrediMidi = {
          "id":menuList.querySelector('[data-text="'+$scope.menu.mercredi.midi+'"]').getAttribute('data-id'),
          "name":$scope.menu.mercredi.midi
        };
        menu.mercredi.splice(0, 1, mercrediMidi);
      }
      if(typeof $scope.menu.mercredi.soir !== "undefined") {
        var mercrediSoir = {
          "id":menuList.querySelector('[data-text="'+$scope.menu.mercredi.soir+'"]').getAttribute('data-id'),
          "name":$scope.menu.mercredi.soir
        };
        menu.mercredi.splice(1, 1, mercrediSoir);
      }
    }
    if(typeof $scope.menu.jeudi !== "undefined") {
      if(typeof $scope.menu.jeudi.midi !== "undefined") {
        var jeudiMidi = {
          "id":menuList.querySelector('[data-text="'+$scope.menu.jeudi.midi+'"]').getAttribute('data-id'),
          "name":$scope.menu.jeudi.midi
        };
        menu.jeudi.splice(0, 1, jeudiMidi);
      }
      if(typeof $scope.menu.mercredi.soir !== "undefined") {
        var jeudiSoir = {
          "id":menuList.querySelector('[data-text="'+$scope.menu.jeudi.soir+'"]').getAttribute('data-id'),
          "name":$scope.menu.jeudi.soir
        };
        menu.jeudi.splice(1, 1, jeudiSoir);
      }
    }
    if(typeof $scope.menu.vendredi !== "undefined") {
      if(typeof $scope.menu.vendredi.midi !== "undefined") {
        var vendrediMidi = {
          "id":menuList.querySelector('[data-text="'+$scope.menu.vendredi.midi+'"]').getAttribute('data-id'),
          "name":$scope.menu.vendredi.midi
        };
        menu.vendredi.splice(0, 1, vendrediMidi);
      }
      if(typeof $scope.menu.vendredi.soir !== "undefined") {
        var vendrediSoir = {
          "id":menuList.querySelector('[data-text="'+$scope.menu.vendredi.soir+'"]').getAttribute('data-id'),
          "name":$scope.menu.vendredi.soir
        };
        menu.vendredi.splice(1, 1, vendrediSoir);
      }
    }
    if(typeof $scope.menu.samedi !== "undefined") {
      if(typeof $scope.menu.samedi.midi !== "undefined") {
        var samediMidi = {
          "id":menuList.querySelector('[data-text="'+$scope.menu.samedi.midi+'"]').getAttribute('data-id'),
          "name":$scope.menu.samedi.midi
        };
        menu.samedi.splice(0, 1, samediMidi);
      }
      if(typeof $scope.menu.samedi.soir !== "undefined") {
        var samediSoir = {
          "id":menuList.querySelector('[data-text="'+$scope.menu.samedi.soir+'"]').getAttribute('data-id'),
          "name":$scope.menu.samedi.soir
        };
        menu.samedi.splice(1, 1, samediSoir);
      }
    }
    if(typeof $scope.menu.dimanche !== "undefined") {
      if(typeof $scope.menu.dimanche.midi !== "undefined") {
        var dimancheMidi = {
          "id":menuList.querySelector('[data-text="'+$scope.menu.dimanche.midi+'"]').getAttribute('data-id'),
          "name":$scope.menu.dimanche.midi
        };
        menu.dimanche.splice(0, 1, dimancheMidi);
      }
      if(typeof $scope.menu.dimanche.soir !== "undefined") {
        var dimancheSoir = {
          "id":menuList.querySelector('[data-text="'+$scope.menu.dimanche.soir+'"]').getAttribute('data-id'),
          "name":$scope.menu.dimanche.soir
        };
        menu.dimanche.splice(1, 1, dimancheSoir);
      }
    }

    $http
      .post('/menus', menu)
      .success(function() {
        globalFunction.setMessage('Votre menu de la semaine a bien été enregistré', 'success');
      })
      .error(function() {
        globalFunction.setMessage('Merci de remplir tous les champs', 'warning');
      });
  };
}).

/* ==========================================================================
   12 = Get List Menus week
   ========================================================================== */

controller('oldMenus', function($scope, $http, $q, $timeout){
  $http.get('menus/').
    success(function(menusUrl) {
      for(var url in menusUrl) {
        $scope.menus = [];
        $http.get(menusUrl[url]).success(function(data){
          $scope.menus.push(data);
        })
      }
    });
  $scope.supMenu = function(id) {

    if(confirm("Vous êtes sûr de vouloir supprimer ce menu ?") === true) {
      $http.delete('/menus/menu/'+id);
      window.location = '#/oldmenus';
    }
  };
  $scope.getListeCourse = function(id, name) {
    var menus = document.querySelectorAll('.menus-'+id+' > td'),
        globalIngredientsArr = [],
        menusSelected = {},
        newArray = [],
        paPromise = $q.defer(),
        sums = {},
        indice = {},
        shopList = {};

    $http.get('/menus/menu/'+id).success(function(d) {
      menusSelected = d;
    });
    
    Array.prototype.forEach.call(menus, function(el, i){
      var id = el.getAttribute('data-id');
      $http.get('/recipes/recipe/'+id).
        then(function(data) {
            //console.log(ingredient.id);
            
            var ingredients = data.data.ingredients,
                ingredientsArray = [];
            ingredients.forEach(function(ingredient) {
              $http.get('/ingredients/ingredient/'+ingredient.id).
              then(function(data) {

                globalIngredientsArr.push([data.data.name, ingredient.qte, ingredient.indice]);
                paPromise.resolve(globalIngredientsArr);
              //
            });
            
        });
      });
    });
    $timeout(function(){
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
            "name" : 'Liste de course de ' + name,
            "idmenu" : id,
            "menuname" : name,
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
            menusSelected.id_listshop = data.id;
            delete menusSelected.id;

            var jsonMenu = JSON.stringify(menusSelected);
            $http.put('/menus/menu/'+id, jsonMenu);
          });
        });
      });
    }, 3000);
  };
}).

/* ==========================================================================
   13 = Update a Menu Week
   ========================================================================== */

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