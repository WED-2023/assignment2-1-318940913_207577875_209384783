// src/services/recipes.js
import recipe_full_view from "../assets/mocks/recipe_full_view.json";
import recipe_preview from "../assets/mocks/recipe_preview.json";
import multiple_recipes_full_view from "../assets/mocks/multiple_recipes_full_view.json";
import multiple_recipe_preview from "../assets/mocks/multiple_recipe_preview.json";


export function mockGetRecipesPreview(amount = 1) {
  let recipes = [];
  for(let i = 0; i < amount; i++){
    recipes.push(multiple_recipe_preview[i]);
  }

  return { data: { recipes: recipes } };
}

export function mockGetRecipePreviewById(id) {
  return { data: { recipe: multiple_recipe_preview.find(recipe => recipe.id === id) } } ;
}

export function mockGetRecipeFullDetails(recipeId) {
  // const recipe = multiple_recipes_full_view.find(r => r.id === recipeId);

  // if (recipe) {
  //   return { status: 200, data: { recipe: recipe } };
  // } else {
  //   return { status: 404, data: { message: "Recipe not found" } };
  // }


    return { status: 200, data: { recipe: recipe_full_view } } ;
  }
  
