"use strict";
/* PARAMETERS FOR SEARCH

API KEY
apiKey=8c9a692a67894e0d9f3d058e04d1f10e

https://api.spoonacular.com/recipes/complexSearch?cuisine=italian&diet=vegan&includeIngredients=tomato&instructionsRequired=true&addRecipeInformation=true&number=10&fillIngredients=true&apiKey=8c9a692a67894e0d9f3d058e04d1f10e

# cuisine (country) cuisine=African,Asian,American,British,Cajun,Caribbean,Chinese,Eastern European,European,French,German,Greek,Indian,Irish,Italian,Japanese,Jewish,Korean,Latin American,Mediterranean,Mexican,Middle Eastern,Nordic,Southern,Spanish,Thai,Vietnamese

# diet diet=gluten_free,ketogenic,vegetarian,lacto-vegetarian,
ovo-vegetarian,vegan,pescetarian,paleo,primal,low_fodmap,whole30

# intolerances intolerances=Dairy,Egg,Gluten,Grain,Peanut,Seafood,Sesame,Shellfish,Soy,Sulfite,Tree Nut,Wheat

# ingredients to include includeIngredients=

# meal type type=main_course,side dish,dessert,appetizer,salad,bread,breakfast,soup,beverage,sauce

# instructions instructionsRequired=true/false

# recipe info addRecipeInformation=true/false

# match the input field titleMatch=string

# number of results number=n

How to divide all this info?

0. Search choices:
  - cuisine, radio drop menu, JUST ONE
  - intolerances, drop menu, MULTIPLE CHOICES
  - diet, MULTIPLE CHOICES
  - ingrdients, MULTIPLE CHOICES
  - type, JUSTONE

1. The cards displayed in the search page should have:
Name, picture, button to favorite, the entire card opens a window that shows everything

2. Recipe windows:
Name, picture but bigger, ingredients, recipe info, instructions step by step

RESOURCES FOR THE STYLING.
# colors  #64A532 #B09647 #450309 #DEE2E3 #7B5536 #1B2625
# styling components:
1. timeline for the recipe instructions https://flowbite.com/docs/components/timeline/
2. search input https://flowbite.com/docs/forms/search-input/
3. dropdown with checkbox for fields like cuisine and other https://flowbite.com/docs/components/dropdowns/
4. card with image for search results https://flowbite.com/docs/components/card/
5?? spinner if queries take too long: https://flowbite.com/docs/components/spinner/

*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _App_favoriteRecipes, _App_resultsRecipe;
const btnOpenFavsMenu = document.querySelector(".open-favorite-menu_btn");
const btnCloseFavsMenu = document.querySelector(".close-favorite-menu_btn");
const favsMenu = document.querySelector(".favorite-menu");
const favsMenuUl = document.querySelector(".favorite-menu-inner");
const searchField = document.querySelector(".search-field");
const btnSearch = document.querySelector(".search-button");
// FILTERS
const filterCuisine = document.querySelector(".ul_cuisine");
const filterCourse = document.querySelector(".ul_course");
const filterDiet = document.querySelector(".ul_diet");
const filterIntol = document.querySelector(".ul_intol");
const filterIngredients = document.querySelector(".ul_ingredients");
const recipeWindow = document.querySelector(".recipe-window");
const btnCloseWindow = document.querySelector(".close-recipe-window");
const btnFavWindowRecipe = document.querySelector(".recipe-favorite_btn-window");
const resultsGrid = document.querySelector(".results-grid");
const toggleFavs = function () {
    // TOGGLE ONLY IF SOME OTHER MENU DIDN'T ADD IT
    if (!(recipeWindow === null || recipeWindow === void 0 ? void 0 : recipeWindow.classList.contains("opacity-100")))
        document.body.classList.toggle("overflow-y-hidden");
    favsMenu === null || favsMenu === void 0 ? void 0 : favsMenu.classList.toggle("translate-sidemenu");
    closeDeleteMenu();
    recipeWindow === null || recipeWindow === void 0 ? void 0 : recipeWindow.classList.remove("opacity-100");
    setTimeout(() => {
        recipeWindow === null || recipeWindow === void 0 ? void 0 : recipeWindow.classList.add("hidden");
    }, 200);
};
const toggleWindow = function () {
    // TOGGLE ONLY IF SOME OTHER MENU DIDN'T ADD IT
    if (favsMenu === null || favsMenu === void 0 ? void 0 : favsMenu.classList.contains("translate-sidemenu"))
        document.body.classList.toggle("overflow-y-hidden");
    favsMenu === null || favsMenu === void 0 ? void 0 : favsMenu.classList.add("translate-sidemenu");
    closeDeleteMenu();
    // SET TIMEOUT SO IT CAN FADE
    recipeWindow === null || recipeWindow === void 0 ? void 0 : recipeWindow.classList.toggle("opacity-100");
    setTimeout(() => {
        recipeWindow === null || recipeWindow === void 0 ? void 0 : recipeWindow.classList.toggle("hidden");
    }, 200);
};
const closeDeleteMenu = function () {
    var _a;
    if (document.querySelector(".delete-menu"))
        (_a = document.querySelector(".delete-menu")) === null || _a === void 0 ? void 0 : _a.remove();
};
btnOpenFavsMenu === null || btnOpenFavsMenu === void 0 ? void 0 : btnOpenFavsMenu.addEventListener("click", toggleFavs);
btnCloseFavsMenu === null || btnCloseFavsMenu === void 0 ? void 0 : btnCloseFavsMenu.addEventListener("click", toggleFavs);
btnCloseWindow === null || btnCloseWindow === void 0 ? void 0 : btnCloseWindow.addEventListener("click", toggleWindow);
// There are two types of fields we search through, either multiple checkbox or singular choices, like the cuisine; a recipe for example can't belong to both asian and italian cuisine. That's how the API works
const returnSingleChoice = function (type, filter) {
    let choice = "";
    const result = Array.from(filter === null || filter === void 0 ? void 0 : filter.getElementsByClassName(`li_${type}`)).find((field) => {
        if (field instanceof HTMLElement) {
            const checkbox = field.querySelector("input");
            choice = (checkbox === null || checkbox === void 0 ? void 0 : checkbox.checked) ? checkbox.dataset[type] : "";
            return choice;
        }
    });
    return choice;
};
const returnMultipleChoices = function (type, filter) {
    let choice = "";
    const result = Array.from(filter === null || filter === void 0 ? void 0 : filter.getElementsByClassName(`li_${type}`)).forEach((field) => {
        if (field instanceof HTMLElement) {
            const checkbox = field.querySelector("input");
            choice += (checkbox === null || checkbox === void 0 ? void 0 : checkbox.checked) ? `${checkbox.dataset[type]}&` : "";
        }
    });
    return choice;
};
class App {
    constructor() {
        _App_favoriteRecipes.set(this, []);
        _App_resultsRecipe.set(this, []);
        this.size = 10;
        btnSearch === null || btnSearch === void 0 ? void 0 : btnSearch.addEventListener("click", this._fetchRecipes.bind(this));
        searchField === null || searchField === void 0 ? void 0 : searchField.addEventListener("keypress", (e) => {
            e.preventDefault();
            if (e.key === "Enter")
                this._fetchRecipes();
        });
        this._getLocalStorage();
    }
    _alreadyFavorited(recipe) {
        return __classPrivateFieldGet(this, _App_favoriteRecipes, "f").some((favRecipe) => favRecipe.id === recipe.id);
    }
    _generateURL() {
        const titleMatch = searchField === null || searchField === void 0 ? void 0 : searchField.value;
        const cuisine = returnSingleChoice("cuisine", filterCuisine);
        const course = returnSingleChoice("course", filterCourse);
        const diet = returnMultipleChoices("diet", filterDiet);
        const intolerances = returnMultipleChoices("intol", filterIntol);
        const ingredients = returnMultipleChoices("ingredients", filterIngredients);
        return `${titleMatch ? "titleMatch=" + titleMatch + "&" : ""}
    ${cuisine ? "cuisine=" + cuisine + "&" : ""}
    ${course ? "type=" + course + "&" : ""}
    ${diet ? "diet=" + diet : ""}
    ${intolerances ? "intolerances=" + intolerances : ""}
    ${ingredients ? "includeIngredients=" + ingredients : ""}`;
    }
    _generateImgBase64(imgBlob) {
        const reader = new FileReader();
        reader.readAsDataURL(imgBlob);
        return new Promise((resolve) => {
            reader.onload = resolve;
        });
    }
    _fetchRecipes() {
        return __awaiter(this, void 0, void 0, function* () {
            const APIKey = "apiKey=ccc74ec2303943b19a3fd0cf79ebccea";
            const searchSpecifics = this._generateURL();
            const URL = `https://api.spoonacular.com/recipes/complexSearch?${searchSpecifics}instructionsRequired=true&addRecipeInformation=true&number=${this.size}&fillIngredients=true&${APIKey}`;
            try {
                const response = yield fetch(URL);
                const data = yield response.json();
                const results = data.results;
                if (results == undefined)
                    throw new Error("couldn't fetch the results from the API");
                // empty grid if a new search starts
                resultsGrid.innerHTML = "";
                // fill then array with recipe objects, once it's filled you display each recipe card in the grid
                this._fillResultsArray(results);
            }
            catch (error) {
                let errorMessage = "Unknown error";
                if (error instanceof Error)
                    errorMessage = error.message;
                console.error(errorMessage);
            }
        });
    }
    _fillResultsArray(results) {
        for (const recipe of results) {
            this._createRecipe(recipe);
        }
    }
    _createRecipe(recipeObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const imgOriginalURL = yield fetch(recipeObject.image);
            const imgBlob = yield imgOriginalURL.blob();
            const imgFile = yield this._generateImgBase64(imgBlob);
            const arrIngredients = [];
            // we format the ingredient object getting only the values we need and having an easier way to fetch them
            recipeObject.extendedIngredients.forEach((ingr) => {
                const newIngredient = {
                    name: ingr.nameClean,
                    amount: ingr.measures.metric.amount,
                    unit: ingr.measures.metric.unitLong,
                };
                arrIngredients.push(newIngredient);
            });
            // for some reason the API has two kind of steps attribute, one is nested in analyzedInstructions, the other is not
            const arrSteps = [];
            if (recipeObject.analyzedInstructions.steps != undefined) {
                recipeObject.analyzedInstructions.forEach((step) => {
                    const newStep = {
                        num: Number(step.number),
                        procedure: step.step,
                    };
                    arrSteps.push(newStep);
                });
            }
            else {
                recipeObject.analyzedInstructions[0].steps.forEach((step) => {
                    const newStep = {
                        num: Number(step.number),
                        procedure: step.step,
                    };
                    arrSteps.push(newStep);
                });
            }
            const recipe = {
                id: recipeObject.id,
                img: imgFile.explicitOriginalTarget.result,
                summary: recipeObject.summary,
                name: recipeObject.title,
                time: recipeObject.readyInMinutes,
                ingredients: arrIngredients,
                steps: arrSteps,
            };
            // we push here so we don't have to have displaying and creation all in one function
            __classPrivateFieldGet(this, _App_resultsRecipe, "f").unshift(recipe);
            this._displayRecipeCard(__classPrivateFieldGet(this, _App_resultsRecipe, "f")[0]);
        });
    }
    _displayRecipeCard(recipe) {
        var _a;
        const recipeCard = `
      <div data-id="${recipe.id}"
      class="recipe-card max-w-sm bg-custom-crimson rounded-lg w-[230px] h-[360px] relative border-2 border-custom-crimson hover:cursor-pointer shadow-recipeCard hover:-translate-y-1 hover:shadow-recipeCardHigher transition-all duration-150"
      >
      <svg
      class="recipe-favorite_btn absolute top-[10px] right-[10px] h-[40px] hover:cursor-pointer"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      >
            <rect width="256" height="256" fill="none" />
            <path
              d="M135.34,28.9l23.23,55.36a8,8,0,0,0,6.67,4.88l59.46,5.14a8,8,0,0,1,4.54,14.07L184.13,147.7a8.08,8.08,0,0,0-2.54,7.89l13.52,58.54a8,8,0,0,1-11.89,8.69l-51.1-31a7.93,7.93,0,0,0-8.24,0l-51.1,31a8,8,0,0,1-11.89-8.69l13.52-58.54a8.08,8.08,0,0,0-2.54-7.89L26.76,108.35A8,8,0,0,1,31.3,94.28l59.46-5.14a8,8,0,0,0,6.67-4.88L120.66,28.9A8,8,0,0,1,135.34,28.9Z"
              class="recipe-favorite_btn-inside transition-all duration-300 ${this._alreadyFavorited(recipe)
            ? "fill-custom-yellow"
            : "hover:fill-custom-lightYellow"} shadow-csu"
              fill="#DEE2E3"
              stroke="#000"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            />
          </svg>

          <img
            class="recipe-image rounded-t-lg w-full object-cover max-h-[140px] min-w-[226px]"
            src="${recipe.img}"
            alt=""
          />

          <div class="p-4">
            <h5
              class="recipe-name mb-2 text-xl font-bold tracking-tight text-[#fff]"
            >
              ${recipe.name.slice(0, 50)}${recipe.name.length > 50 ? "..." : ""}
            </h5>

            <p
              class="recipe-description font-normal text-[0.9rem] text-[#b59a9d]"
            >
              ${recipe.summary.slice(0, 90)}...
            </p>
          </div>
        </div>`;
        resultsGrid === null || resultsGrid === void 0 ? void 0 : resultsGrid.insertAdjacentHTML("afterbegin", recipeCard);
        (_a = document.querySelector(".recipe-card")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
            if (!this._colorFavorite.call(this, recipe, e)) {
                this._fillRecipeWindow(recipe);
                toggleWindow();
            }
        });
    }
    _displayFavoriteCard(recipe) {
        var _a;
        const favoriteCard = `<div
            data-id="${recipe.id}"
            class="recipe-card-favorite max-w-sm bg-custom-crimson rounded-lg w-full h-[140px] relative flex flex-row bg-[url(images/favorite_bg.png)] bg-cover "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              class="open-recipe_btn absolute w-[35px] right-[10px] bottom-[10px] rounded-full bg-custom-lightCrimson p-1 hover:cursor-pointer hover:shadow-openRecipe"
                
            >
              <rect width="256" height="256" fill="none" />
              <path
                d="M128,88a32,32,0,0,1,32-32h64a8,8,0,0,1,8,8V192a8,8,0,0,1-8,8H160a32,32,0,0,0-32,32"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
              <path
                d="M24,192a8,8,0,0,0,8,8H96a32,32,0,0,1,32,32V88A32,32,0,0,0,96,56H32a8,8,0,0,0-8,8Z"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
              <line
                x1="160"
                y1="96"
                x2="200"
                y2="96"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
              <line
                x1="160"
                y1="128"
                x2="200"
                y2="128"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
              <line
                x1="160"
                y1="160"
                x2="200"
                y2="160"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
            </svg>

            <img
              class="recipe-image-favorite rounded-t-lg object-cover w-[124px]"
              src="${recipe.img}"
              alt=""
            />

            <h5
              class="recipe-name-favorite p-4 mb-2 text-lg font-bold tracking-tight text-[#fff]"
            >
              ${recipe.name}
            </h5>
          </div>`;
        favsMenuUl === null || favsMenuUl === void 0 ? void 0 : favsMenuUl.insertAdjacentHTML("afterbegin", favoriteCard);
        const currentCard = favsMenuUl === null || favsMenuUl === void 0 ? void 0 : favsMenuUl.querySelector(".recipe-card-favorite");
        currentCard.addEventListener("contextmenu", (e) => {
            var _a;
            e.preventDefault();
            closeDeleteMenu();
            const positions = `top: ${e.layerY}px;left: ${e.layerX}px;`;
            const deleteMenu = `
      <div class="delete-menu absolute              
                bg-custom-lightCrimson
                text-custom-paleGray w-[75px]
                  text-center py-2 hover:cursor-pointer z-40"
                   style="${positions}">
                  Delete
    </div>`;
            currentCard === null || currentCard === void 0 ? void 0 : currentCard.insertAdjacentHTML("afterbegin", deleteMenu);
            (_a = currentCard === null || currentCard === void 0 ? void 0 : currentCard.querySelector(".delete-menu")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                closeDeleteMenu();
                this._toggleToFavorites(recipe);
                this._updateStars(recipe);
            });
            // if (e.button == 2) console.log(`oiii`);
        });
        // since we inject the favorited card using this method, we have to query for the button instead of attacching the event some other way
        (_a = document
            .querySelector(".open-recipe_btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            toggleFavs();
            this._fillRecipeWindow(recipe);
            toggleWindow();
        });
    }
    _fillRecipeWindow(recipe) {
        var _a, _b;
        let ingredientsList = "";
        recipe.ingredients.forEach((ingredient) => {
            ingredientsList += `<li class="ingredients_li">
              <span class="ingredient_num">${ingredient.amount}</span>&nbsp;
              <span class="ingredient_unit">${ingredient.unit}</span>&nbsp;of
              <span class="ingredient_name">${ingredient.name}</span>
            </li>`;
        });
        let stepsList = "";
        recipe.steps.forEach((step) => {
            stepsList += `<li class="mb-6 ml-4">
              <div
                class="absolute w-3 h-3 bg-custom-green rounded-full mt-1.5 -left-1.5 border border-white"
              ></div>
              <h3 class="text-2xl step-number">${step.num}.</h3>
              <p class="mb-4 text-base font-normal step-procedure">
                ${step.procedure}
              </p>
            </li>`;
        });
        recipeWindow.innerHTML = `
     <div class="col-span-4 relative border-r-2 border-[#4d5159]" data-id="${recipe.id}">
        <svg
          class="recipe-favorite_btn-window absolute top-[10px] right-[10px] h-[40px] hover:cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
        >
          <rect width="256" height="256" fill="none" />
          <path
            d="M135.34,28.9l23.23,55.36a8,8,0,0,0,6.67,4.88l59.46,5.14a8,8,0,0,1,4.54,14.07L184.13,147.7a8.08,8.08,0,0,0-2.54,7.89l13.52,58.54a8,8,0,0,1-11.89,8.69l-51.1-31a7.93,7.93,0,0,0-8.24,0l-51.1,31a8,8,0,0,1-11.89-8.69l13.52-58.54a8.08,8.08,0,0,0-2.54-7.89L26.76,108.35A8,8,0,0,1,31.3,94.28l59.46-5.14a8,8,0,0,0,6.67-4.88L120.66,28.9A8,8,0,0,1,135.34,28.9Z"
            class="recipe-favorite_btn-inside transition-all duration-300 ${this._alreadyFavorited(recipe)
            ? "fill-custom-yellow"
            : "hover:fill-custom-lightYellow"} shadow-csu"
            fill="#DEE2E3"
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
        </svg>

        <img
          class="recipe-image-window rounded-t-lg w-full object-cover max-h-[250px]"
          src="${recipe.img}"
          alt=""
        />
        <div class="p-6">
          <p class="flex flex-row items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              class="w-[20px] rounded-full text-white"
            >
              <rect width="256" height="256" fill="none" />
              <line
                x1="96"
                y1="16"
                x2="96"
                y2="48"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
              <line
                x1="128"
                y1="16"
                x2="128"
                y2="48"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
              <line
                x1="160"
                y1="16"
                x2="160"
                y2="48"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
              <path
                d="M48,80H208a8,8,0,0,1,8,8v96a24,24,0,0,1-24,24H64a24,24,0,0,1-24-24V88A8,8,0,0,1,48,80Z"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
              <line
                x1="248"
                y1="96"
                x2="216"
                y2="120"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
              <line
                x1="8"
                y1="96"
                x2="40"
                y2="120"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
            </svg>
            &nbsp;&nbsp; <span class="cook-time"> ${recipe.time} minutes </span>&nbsp;
            cooking time
          </p>
          <h2 class="text-2xl my-3 text-custom-elegantGreen">Ingredients</h2>
          <hr class="border-t border-[#dee2e352] mb-3" />
          <ul
            class="ingredients_ul list-disc pl-5 flex flex-col gap-2 overflow-y-scroll h-[30vh] favorite-scrollbar"
          >
                    ${ingredientsList}   
          </ul>
        </div>
      </div>
      <div class="p-6 pt-9 col-span-6 relative h-[90vh] flex flex-col">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          class="close-recipe-window text-white absolute w-[40px] top-[10px] right-[10px] hover:cursor-pointer"
        >
          <rect width="256" height="256" fill="none" />
          <line
            x1="200"
            y1="56"
            x2="56"
            y2="200"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
          <line
            x1="200"
            y1="200"
            x2="56"
            y2="56"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          />
        </svg>
        <div>
            <h1 class="recipe-window-name text-4xl uppercase mb-3">
              ${recipe.name}
            </h1>

            <h2 class="text-2xl mb-3 text-custom-elegantGreen">Steps</h2>
        </div>
        <div class="overflow-y-scroll favorite-scrollbar flex-inital">
          <ol class="relative border-l border-custom-paleGray mx-2">
                  ${stepsList}  
          </ol>
        </div>
      </div>`;
        (_a = document
            .querySelector(".recipe-favorite_btn-window")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this._colorFavorite.bind(this, recipe));
        (_b = document
            .querySelector(".close-recipe-window")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", toggleWindow);
    }
    _colorFavorite(recipe, e) {
        if (!(e.target instanceof Element))
            return;
        // when the favorite button is clicked, we don't open the recipe full window
        if (e.target.classList.contains("recipe-favorite_btn-inside")) {
            this._toggleToFavorites(recipe);
            this._updateStars(recipe);
            return true;
        }
        return false;
    }
    _updateStars(recipe) {
        document.querySelectorAll(`[data-id="${recipe.id}"]`).forEach((el) => {
            const star = el.querySelector(".recipe-favorite_btn-inside");
            if (star) {
                star.classList.toggle("fill-custom-yellow");
                star.classList.toggle("hover:fill-custom-lightYellow");
            }
        });
    }
    _toggleToFavorites(recipe) {
        // this methods returns -1 if there no recipes with this ID in the array
        const pos = __classPrivateFieldGet(this, _App_favoriteRecipes, "f").findIndex((rec) => rec.id === recipe.id);
        // DELETE AND RESHAPE FAVORITES LIST IF WE ARE REMOVING
        if (pos >= 0) {
            __classPrivateFieldSet(this, _App_favoriteRecipes, __classPrivateFieldGet(this, _App_favoriteRecipes, "f").filter((rec) => rec.id !== recipe.id), "f");
            favsMenuUl.innerHTML = "";
            __classPrivateFieldGet(this, _App_favoriteRecipes, "f").forEach((favRecipe) => this._displayFavoriteCard(favRecipe));
        } // PUSH AND DISPLAY IF WE ARE ENTERING A NEW FAVORITE
        else {
            __classPrivateFieldGet(this, _App_favoriteRecipes, "f").push(recipe);
            this._displayFavoriteCard(recipe);
        }
        this._setLocalStorage();
    }
    _getLocalStorage() {
        const favorites = localStorage.getItem("favorites") || "";
        // IN CASE THE USER NEVER SAVED ANYTHING
        if (!favorites)
            return;
        // OVERWRITE ARRAY FROM PAST SAVINGS
        __classPrivateFieldSet(this, _App_favoriteRecipes, JSON.parse(favorites), "f");
        // DISPLAY FAVORITES AT PAGE LOAD
        __classPrivateFieldGet(this, _App_favoriteRecipes, "f").forEach((favRecipe) => this._displayFavoriteCard(favRecipe));
    }
    _setLocalStorage() {
        localStorage.setItem("favorites", JSON.stringify(__classPrivateFieldGet(this, _App_favoriteRecipes, "f")));
    }
    _emptyAll() {
        localStorage.removeItem("favorites");
        __classPrivateFieldSet(this, _App_favoriteRecipes, [], "f");
        __classPrivateFieldSet(this, _App_resultsRecipe, [], "f");
    }
}
_App_favoriteRecipes = new WeakMap(), _App_resultsRecipe = new WeakMap();
const a = new App();
