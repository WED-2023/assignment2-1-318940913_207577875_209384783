// src/services/user.js
import axios from "axios";
const API_URL = "http://127.0.0.1:80";
import recipe_full_view from "../assets/mocks/recipe_full_view.json";
import recipe_preview from "../assets/mocks/recipe_preview.json";

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

export async function getRecipeInMyRecipes() {
  try {
    const response = await axios.get(`${API_URL}/users/MyRecipes`);
    if (response.status != 200) return [];
    const my_recipes = response.data;
    return my_recipes;
  } catch (error) {
    console.error("Error in get my recipes: ", error);
    throw error;
  }
}

export async function getRecipeInFavorites(with_preview = true) {
  try {
    const response = await axios.get(`${API_URL}/users/FavoritesRecipes`);
    if (response.status != 200) return [];
    if (with_preview) {
      const credentials =  {
        recipes_id: response.data,
      };
      const preview_response = await axios.post(
        `${API_URL}/recipes/RecipesPreview`,
        credentials,
        {
          withCredentials: true,
        }
      );
      return preview_response.data;
    }
    const favorites = response.data;
    return favorites;
  } catch (error) {
    console.error("Error in get favorites: ", error);
    throw error;
  }
}

export async function isRecipeInFavorites(recipe_id) {
  try {
    const favorites = await getRecipeInFavorites(false);
    const isFavorite = favorites.some((recipeId) => recipeId == recipe_id);
    return isFavorite;
  } catch (error) {
    console.error("Error check if recipe in favorites: ", error);
    throw error;
  }
}


export async function markAsFavorite(credentials) {
  try {
    const response = await axios.post(
      `${API_URL}/users/FavoritesRecipes`,
      credentials,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error mark recipe as favorite: ", error);
    throw error;
  }
}

export async function unMarkAsFavorite(recipe_id) {
  try {
    const response = await axios.delete(`${API_URL}/users/FavoritesRecipes`, {
      data: { recipeId: recipe_id },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error unmarking recipe as favorite: ", error);
    throw error;
  }
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

export async function addToMyMeal(credentials) {
  try {
    const response = await axios.post(
      `${API_URL}/users/MyMeal`,
      credentials,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error add recipe to my meal: ", error);
    throw error;
  }
}

export async function getRecipeProgress (recipeId) {
  try {
    const response = await axios.get(`${API_URL}/users/RecipeMakingProgress/${recipeId}`);
    console.log("getRecipeProgress - response = ", response);
    console.log("getRecipeProgress - response.data = ", response.data);
    console.log("getRecipeProgress - response.data.recipe_progress = ", response.data.recipe_progress);
    return response.data.recipe_progress;
  } catch (error) {
    throw new Error(`Error fetching recipe: ${error.response ? error.response.data : error.message}`);
  }
};

export async function setRecipeProgress(credentials) {
  try {
    const response = await axios.put(
      `${API_URL}/users/RecipeMaking`,
      credentials,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error set recipe progress: ", error);
    throw error;
  }
}


export function mockAddFavorite(recipeId, like) {
  return {
    status: 200,
    response: {
      data: {
        message: "The Recipe successfully saved as favorite",
        success: true,
      },
    },
  };
}

export function mockAddUserRecipe(recipeDetails) {
  return {
    status: 200,
    response: {
      data: {
        message: "The Recipe successfully added to My Recipes",
        success: true,
      },
    },
  };
}
