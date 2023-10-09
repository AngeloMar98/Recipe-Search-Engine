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

const btnOpenFavsMenu: HTMLElement | null = document.querySelector(
  ".open-favorite-menu_btn"
);
const btnCloseFavsMenu: HTMLElement | null = document.querySelector(
  ".close-favorite-menu_btn"
);
const favsMenu: HTMLElement | null = document.querySelector(".favorite-menu");
const favsMenuUl: HTMLElement | null = document.querySelector(
  ".favorite-menu-inner"
);

const searchField: HTMLInputElement | null =
  document.querySelector(".search-field");
const btnSearch: HTMLElement | null = document.querySelector(".search-button");

// FILTERS
const filterCuisine: HTMLElement | null = document.querySelector(".ul_cuisine");
const filterCourse: HTMLElement | null = document.querySelector(".ul_course");
const filterDiet: HTMLElement | null = document.querySelector(".ul_diet");
const filterIntol: HTMLElement | null = document.querySelector(".ul_intol");
const filterIngredients: HTMLElement | null =
  document.querySelector(".ul_ingredients");

const recipeWindow: HTMLElement | null =
  document.querySelector(".recipe-window");
const btnCloseWindow: HTMLElement | null = document.querySelector(
  ".close-recipe-window"
);
const btnFavWindowRecipe: HTMLElement | null = document.querySelector(
  ".recipe-favorite_btn-window"
);
const resultsGrid: HTMLElement | null = document.querySelector(".results-grid");

const toggleFavs = function () {
  // TOGGLE ONLY IF SOME OTHER MENU DIDN'T ADD IT
  if (!recipeWindow?.classList.contains("opacity-100"))
    document.body.classList.toggle("overflow-y-hidden");

  favsMenu?.classList.toggle("translate-sidemenu");
  closeDeleteMenu();

  recipeWindow?.classList.remove("opacity-100");
  setTimeout(() => {
    recipeWindow?.classList.add("hidden");
  }, 200);
};

const toggleWindow = function () {
  // TOGGLE ONLY IF SOME OTHER MENU DIDN'T ADD IT
  if (favsMenu?.classList.contains("translate-sidemenu"))
    document.body.classList.toggle("overflow-y-hidden");

  favsMenu?.classList.add("translate-sidemenu");
  closeDeleteMenu();

  // SET TIMEOUT SO IT CAN FADE
  recipeWindow?.classList.toggle("opacity-100");
  setTimeout(() => {
    recipeWindow?.classList.toggle("hidden");
  }, 200);
};

const closeDeleteMenu = function () {
  if (document.querySelector(".delete-menu"))
    document.querySelector(".delete-menu")?.remove();
};

btnOpenFavsMenu?.addEventListener("click", toggleFavs);
btnCloseFavsMenu?.addEventListener("click", toggleFavs);

btnCloseWindow?.addEventListener("click", toggleWindow);
// the buttons to open the window are on the recipe cards

// this interfaces facilitate storing and fetching the data from the API, and once every object is stored having them as types makes the code more robust
interface Ingredient {
  name: string;
  unit: string;
  amount: number;
}

interface Step {
  num: number;
  procedure: string;
}

interface Recipe {
  id: number;
  img: string;
  name: string;
  summary: string;
  ingredients: Ingredient[];
  time: number;
  steps: Step[];
}

interface Keyable {
  [key: string]: any;
}

// There are two types of fields we search through, either multiple checkbox or singular choices, like the cuisine; a recipe for example can't belong to both asian and italian cuisine. That's how the API works
const returnSingleChoice = function (type: string, filter: HTMLElement | null) {
  let choice: string | undefined = "";
  const result = Array.from(
    <HTMLElement | any>filter?.getElementsByClassName(`li_${type}`)
  ).find((field) => {
    if (field instanceof HTMLElement) {
      const checkbox = field.querySelector("input");
      choice = checkbox?.checked ? checkbox.dataset[type] : "";
      return choice;
    }
  });

  return choice;
};

const returnMultipleChoices = function (
  type: string,
  filter: HTMLElement | null
) {
  let choice: string = "";
  const result = Array.from(
    <HTMLElement | any>filter?.getElementsByClassName(`li_${type}`)
  ).forEach((field) => {
    if (field instanceof HTMLElement) {
      const checkbox = field.querySelector("input");

      choice += checkbox?.checked ? `${checkbox.dataset[type]}&` : "";
    }
  });

  return choice;
};

class App {
  #favoriteRecipes: Recipe[] = [];
  #resultsRecipe: Recipe[] = [];

  constructor() {
    btnSearch?.addEventListener("click", this._fetchRecipes.bind(this));
    this._getLocalStorage();
  }

  _alreadyFavorited(recipe: Recipe): boolean {
    return this.#favoriteRecipes.some(
      (favRecipe) => favRecipe.id === recipe.id
    );
  }

  _generateURL() {
    const titleMatch = searchField?.value;
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

  async _generateImgBase64(imgBlob: any) {
    const reader = new FileReader();

    reader.readAsDataURL(imgBlob);
    reader.onloadend = function () {
      return reader.result;
    };
  }

  async _fetchRecipes() {
    const APIKey = "apiKey=ccc74ec2303943b19a3fd0cf79ebccea";
    const searchSpecifics = this._generateURL();
    const URL: string = `https://api.spoonacular.com/recipes/complexSearch?${searchSpecifics}instructionsRequired=true&addRecipeInformation=true&number=5&fillIngredients=true&${APIKey}`;

    try {
      const response = await fetch(URL);
      const results = (await response.json()).results;

      results.forEach((recipe: Keyable) => {
        this._createRecipe(recipe);
      });
      resultsGrid!.innerHTML = "";

      console.log(`created all recipes`);
      this.#resultsRecipe.forEach((recipe) => {
        this._displayRecipeCard(recipe);
        console.log(`displaying recipe`);
      });
    } catch (error) {
      let errorMessage = "Unknown error";

      if (error instanceof Error) errorMessage = error.message;
    }
  }

  async _createRecipe(recipeObject: Keyable) {
    console.log(`one more recipe`);

    const imgOriginalURL = await fetch(recipeObject.image);
    const imgBlob = await imgOriginalURL.blob();
    const imgFile = await this._generateImgBase64(imgBlob);

    console.log(imgFile);
    const arrIngredients: Ingredient[] = [];

    // we format the ingredient object getting only the values we need and having an easier way to fetch them
    recipeObject.extendedIngredients.forEach((ingr: any) => {
      const newIngredient: Ingredient = {
        name: ingr.nameClean,
        amount: ingr.measures.metric.amount,
        unit: ingr.measures.metric.unitShort,
      };
      arrIngredients.push(newIngredient);
    });

    // for some reason the API has two kind of steps attribute, one is nested in analyzedInstructions, the other is not
    const arrSteps: Step[] = [];

    if (recipeObject.analyzedInstructions.steps == undefined) {
      recipeObject.analyzedInstructions.forEach((step: any) => {
        const newStep: Step = {
          num: Number(step.number),
          procedure: step.step,
        };

        arrSteps.push(newStep);
      });
    } else {
      recipeObject.analyzedInstructions[0].steps.forEach((step: any) => {
        const newStep: Step = {
          num: Number(step.number),
          procedure: step.step,
        };
        arrSteps.push(newStep);
      });
    }

    const recipe: Recipe = {
      id: recipeObject.id,
      img: imgFile,
      summary: recipeObject.summary,
      name: recipeObject.title,
      time: recipeObject.readyInMinutes,
      ingredients: arrIngredients,
      steps: arrSteps,
    };

    // we push here so we don't have to have displaying and creation all in one function
    this.#resultsRecipe.push(recipe);
  }

  _displayRecipeCard(recipe: Recipe) {
    const recipeCard: string = `
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
              class="recipe-favorite_btn-inside transition-all duration-300 ${
                this._alreadyFavorited(recipe)
                  ? "fill-custom-yellow"
                  : "hover:fill-custom-lightYellow"
              } shadow-csu"
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
              ${recipe.name}
            </h5>

            <p
              class="recipe-description font-normal text-[0.9rem] text-[#b59a9d]"
            >
              ${recipe.summary.slice(0, 90)}...
            </p>
          </div>
        </div>`;

    resultsGrid?.insertAdjacentHTML("afterbegin", recipeCard);

    document.querySelector(".recipe-card")?.addEventListener(
      "click",
      (e) => {
        if (!this._colorFavorite.call(this, recipe, e)) {
          this._fillRecipeWindow(recipe);
          toggleWindow();
        }
      }

      // if (!(e.target instanceof Element)) return;

      // // when the favorite button is clicked, we don't open the recipe full window
      // if (e.target.classList.contains("recipe-favorite_btn-inside")) {
      //   this._toggleToFavorites(recipe);
      //   e.target.classList.toggle("fill-custom-yellow");
      //   e.target.classList.toggle("hover:fill-custom-lightYellow");
      //   return;
      // }
    );
  }

  _displayFavoriteCard(recipe: Recipe) {
    const favoriteCard: string = `<div
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
              class="recipe-image-favorite rounded-t-lg object-cover h-full w-[130px]"
              src="${recipe.img}"
              alt=""
            />

            <h5
              class="recipe-name-favorite p-4 mb-2 text-lg font-bold tracking-tight text-[#fff]"
            >
              ${recipe.name}
            </h5>
          </div>`;

    favsMenuUl?.insertAdjacentHTML("afterbegin", favoriteCard);

    const currentCard = favsMenuUl?.querySelector(".recipe-card-favorite");

    currentCard!.addEventListener("contextmenu", (e: any) => {
      e.preventDefault();

      closeDeleteMenu();

      const positions: string = `top: ${e.layerY}px;left: ${e.layerX}px;`;

      const deleteMenu: string = `
      <div class="delete-menu absolute              
                bg-custom-lightCrimson
                text-custom-paleGray w-[75px]
                  text-center py-2 hover:cursor-pointer"
                   style="${positions}">
                  Delete
    </div>`;

      currentCard?.insertAdjacentHTML("afterbegin", deleteMenu);

      currentCard
        ?.querySelector(".delete-menu")
        ?.addEventListener("click", () => {
          closeDeleteMenu();
          this._toggleToFavorites(recipe);
          this._updateStars(recipe);
        });
      // if (e.button == 2) console.log(`oiii`);
    });
    // since we inject the favorited card using this method, we have to query for the button instead of attacching the event some other way
    document
      .querySelector(".open-recipe_btn")
      ?.addEventListener("click", () => {
        toggleFavs();
        this._fillRecipeWindow(recipe);
        toggleWindow();
      });
  }

  _fillRecipeWindow(recipe: Recipe) {
    let ingredientsList: string = "";
    recipe.ingredients.forEach((ingredient) => {
      ingredientsList += `<li class="ingredients_li">
              <span class="ingredient_num">${ingredient.amount}</span>&nbsp;
              <span class="ingredient_unit">${ingredient.unit}</span>&nbsp;of
              <span class="ingredient_name">${ingredient.name}</span>
            </li>`;
    });

    let stepsList: string = "";
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

    recipeWindow!.innerHTML = `
     <div class="col-span-4 relative border-r-2 border-[#4d5159]" data-id="${
       recipe.id
     }">
        <svg
          class="recipe-favorite_btn-window absolute top-[10px] right-[10px] h-[40px] hover:cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
        >
          <rect width="256" height="256" fill="none" />
          <path
            d="M135.34,28.9l23.23,55.36a8,8,0,0,0,6.67,4.88l59.46,5.14a8,8,0,0,1,4.54,14.07L184.13,147.7a8.08,8.08,0,0,0-2.54,7.89l13.52,58.54a8,8,0,0,1-11.89,8.69l-51.1-31a7.93,7.93,0,0,0-8.24,0l-51.1,31a8,8,0,0,1-11.89-8.69l13.52-58.54a8.08,8.08,0,0,0-2.54-7.89L26.76,108.35A8,8,0,0,1,31.3,94.28l59.46-5.14a8,8,0,0,0,6.67-4.88L120.66,28.9A8,8,0,0,1,135.34,28.9Z"
            class="recipe-favorite_btn-inside transition-all duration-300 ${
              this._alreadyFavorited(recipe)
                ? "fill-custom-yellow"
                : "hover:fill-custom-lightYellow"
            } shadow-csu"
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
            &nbsp;&nbsp; <span class="cook-time"> 15 minutes </span>&nbsp;
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
      <div class="p-6 pt-9 col-span-6 relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          class="close-recipe-window text-white absolute w-[40px] right-[30px] hover:cursor-pointer"
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
        <h1 class="recipe-window-name text-4xl uppercase mb-3">
          ${recipe.name}
        </h1>

        <h2 class="text-2xl mb-3 text-custom-elegantGreen">Steps</h2>

        <div class="overflow-y-scroll favorite-scrollbar h-[65vh]">
          <ol class="relative border-l border-custom-paleGray mx-2">
                  ${stepsList}  
          </ol>
        </div>
      </div>`;

    document
      .querySelector(".recipe-favorite_btn-window")
      ?.addEventListener("click", this._colorFavorite.bind(this, recipe));

    document
      .querySelector(".close-recipe-window")
      ?.addEventListener("click", toggleWindow);
  }

  _colorFavorite(recipe: Recipe, e: any) {
    if (!(e.target instanceof Element)) return;

    // when the favorite button is clicked, we don't open the recipe full window
    if (e.target.classList.contains("recipe-favorite_btn-inside")) {
      this._toggleToFavorites(recipe);
      this._updateStars(recipe);
      return true;
    }
    return false;
  }

  _updateStars(recipe: Recipe) {
    document.querySelectorAll(`[data-id="${recipe.id}"]`).forEach((el) => {
      const star: Element = el.querySelector(".recipe-favorite_btn-inside")!;

      if (star) {
        star.classList.toggle("fill-custom-yellow");
        star.classList.toggle("hover:fill-custom-lightYellow");
      }
    });
  }
  _toggleToFavorites(recipe: Recipe) {
    // this methods returns -1 if there no recipes with this ID in the array
    const pos: number = this.#favoriteRecipes.findIndex(
      (rec) => rec.id === recipe.id
    );

    // DELETE AND RESHAPE FAVORITES LIST IF WE ARE REMOVING
    if (pos >= 0) {
      this.#favoriteRecipes = this.#favoriteRecipes.filter(
        (rec) => rec.id !== recipe.id
      );

      favsMenuUl!.innerHTML = "";
      this.#favoriteRecipes.forEach((favRecipe) =>
        this._displayFavoriteCard(favRecipe)
      );
    } // PUSH AND DISPLAY IF WE ARE ENTERING A NEW FAVORITE
    else {
      this.#favoriteRecipes.push(recipe);
      this._displayFavoriteCard(recipe);
    }

    this._setLocalStorage();
  }

  _getLocalStorage() {
    const favorites: string = localStorage.getItem("favorites") || "";

    // IN CASE THE USER NEVER SAVED ANYTHING
    if (!favorites) return;

    // OVERWRITE ARRAY FROM PAST SAVINGS
    this.#favoriteRecipes = JSON.parse(favorites);

    // DISPLAY FAVORITES AT PAGE LOAD
    this.#favoriteRecipes.forEach((favRecipe) =>
      this._displayFavoriteCard(favRecipe)
    );
  }

  _setLocalStorage() {
    localStorage.setItem("favorites", JSON.stringify(this.#favoriteRecipes));
  }

  _emptyAll() {
    localStorage.removeItem("favorites");
    this.#favoriteRecipes = [];
    this.#resultsRecipe = [];
  }
}

const a = new App();
