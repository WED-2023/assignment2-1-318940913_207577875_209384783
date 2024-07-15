// src/services/user.js
import recipe_full_view from "../assets/mocks/recipe_full_view.json";
import recipe_preview from "../assets/mocks/recipe_preview.json";
import axios from 'axios';
const API_URL = 'http://127.0.0.1:80';

  export function mockAddFavorite(recipeId,like) {
    return { status: 200, response: { data: { message: "The Recipe successfully saved as favorite", success: true}} };
  }
  
  export function mockAddUserRecipe(recipeDetails) {
    return { status: 200, response: { data: { message: "The Recipe successfully added to My Recipes", success: true}} };

  }

  export async function updateLastViewedRecipesServer(recipe_Id) {
    try {
      const response = await axios.post(`${API_URL}/users/LastViewedRecipes`, {recipeId: recipe_Id}, {withCredentials: true});
      return response;
    } catch (error) {
      console.error('Error updating last viewed:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
    
  export async function createNewRecipe(credentials) {
    try {
      const response = await axios.post(
        `${API_URL}/users/addNewRecipe`,
        credentials,
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      console.error("Error mark recipe as favorite: ", error);
      throw error;
    }
  }