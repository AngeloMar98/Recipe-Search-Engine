/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*.{html,js,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        default: ['"Lato"'],
      },
      boxShadow: {
        greenDropMenu: "0 1px 15px 1px  #93c0703b;",
        openFavoriteMenu: "0 1px 15px 6px  #64a532e5;",
        buttonSearch: "0 1px 10px 1px  #facc15;",
        favoriteMenu: "0 0 10px 9999px  #00000090;",
        recipeCard: "0 10px 30px 5px  #0000004f;",
        recipeCardHigher: "0 15px 35px 18px  #0000004f;",
        openRecipe: "0 0 10px 4px  #ffffff62;",
      },
      colors: {
        custom: {
          paleBlue: "#4d5159",
          lessPaleBlue: "#909398",
          blue: "#212630",
          elegantGreen: "#5C9E74",
          lightGreen: "#93c070",
          green: "#64A532",

          paleGreen: "#3e4c4a",
          lighterPaleGreen: "#515e5c",
          darkGreen: "#0E1F1D",
          deadGreen: "#1B2625",
          brown: "#A28F6A",
          tortilla: "#B09647",
          caramel: "#7B5536",
          lightCrimson: "#8f686b",
          crimson: "#450309",
          beige: "#D0C0A2",
          lightYellow: "#fef08a",
          yellow: "#facc15",
          lightGray: "#bfbd9c",
          paleGray: "#DEE2E3",
        },
      },
    },
    screens: {
      tablet: "800px",
      laptop: "960px",
      desktop: "1280px",
    },
  },
  plugins: [require("flowbite/plugin")],
};
