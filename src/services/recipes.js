// src/services/recipes.js
import recipe_full_view from "../assets/mocks/recipe_full_view.json";
import recipe_preview from "../assets/mocks/recipe_preview.json";
import multiple_recipes_full_view from "../assets/mocks/multiple_recipes_full_view.json";
import multiple_recipe_preview from "../assets/mocks/multiple_recipe_preview.json";
import family_recipes_full_view from "../assets/mocks/family_recipes_full_view.json";
import axios from 'axios';
const API_URL = 'http://127.0.0.1:80';

export function mockGetRecipesPreview(amount = 1) {
  let recipes = [];
  for(let i = 0; i < amount; i++){
    recipes.push(multiple_recipe_preview[i]);
  }

  return { data: { recipes: recipes } };
}
export function mockGetAllRecipesPreview() {
  let recipes = [];
  let i = 0;
  
  while (i < multiple_recipe_preview.length) {
    recipes.push(multiple_recipe_preview[i]);
    i++;
  }

  return { data: { recipes: recipes } };
}


export function mockGetFamilyRecipes() {
  let recipes = [];
  let i = 0;
  
  while (i < family_recipes_full_view.length) {
    recipes.push(family_recipes_full_view[i]);
    i++;
  }

  return { data: { recipes: recipes } };
}

export function mockGetRecipePreviewById(id) {
  return { data: { recipe: multiple_recipe_preview.find(recipe => recipe.id === id) } } ;

}

export function mockGetRecipeFullDetails(recipeId, testMode=false) {
  if(testMode)
    return { status: 200, data: { recipe: recipe_full_view } } ;

  const recipe = multiple_recipes_full_view.find(r => r.id === recipeId);

  if (recipe) {
    return { status: 200, data: { recipe: recipe } };
  } else {
    return { status: 404, data: { message: "Recipe not found" } };
  }


  }
// --------------------------- Server Connection !!!! ---------------------------------------------------------
  export async function fetchRandomRecipesFromServer() {
    try {
      const response = await axios.get(`${API_URL}/recipes/random`, {
        params: { number: 3 },
        withCredentials: true
      });
      let recipes = response.data;
      return { status:200, data:{recipes}};
    } catch (error) {
      console.error('Error fetching random recipes:', error);
      return { data: { recipes: [] } };
    }
  }
  

  export async function fetchLastViewedRecipesFromServer  () {
    try {
      const response = await axios.get(`${API_URL}/users/LastViewedRecipes`);
      let recipes = response.data;
      return { status:200, data:{recipes}};
    } catch (error) {
      console.error('Error fetching last viewed recipes:', error);
      throw error;
    }
  }
  export async function checkLastViewedRecipesFromServer(recipeID) {
    try {
      const response = await axios.get(`${API_URL}/users/IsLastViewedRecipe`, {
        params: {recipeId: recipeID }});
      return response.data.isLastViewed;
    } catch (error) {
      console.error('Error checking last viewed recipes:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
  export async function getRecipeFullPage (recipeId) {
    try {
      const response = await axios.get(`${API_URL}/recipes/recipe/${recipeId}`);
      return response;
    } catch (error) {
      throw new Error(`Error fetching recipe: ${error.response ? error.response.data : error.message}`);
    }
  };

  export async function getSearchResultsFromServer(recipeName,cuisines,diets,intolerances,number,sortBy) {
    try {
      const response = await axios.get(`${API_URL}/recipes/search`, {
        params: {
          recipeName: recipeName,
          cuisine: cuisines,
          diet: diets,
          intolerance: intolerances,
          number:number,
          sort:sortBy
        }});
      console.log(" search response = ",response);
      return response.data;
    } catch (error) {
      console.error('Error while trying to search:', error.response ? error.response.data : error.message);
      throw error;
    }
  }



  // ------------------------------------------------------------------------------------
