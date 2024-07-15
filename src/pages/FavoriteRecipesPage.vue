<template>
  <div>
    <RecipePreviewList
      title="My Favorites"
      :recipes="favRecipes"
      @likedChanged="handleLikedChanged"
    ></RecipePreviewList>
  </div>
</template>

<script>
import RecipePreviewList from "@/components/RecipePreviewList.vue";
import { getRecipeInFavorites, markAsFavorite, unMarkAsFavorite } from "../services/user.js";

export default {
  components: {
    RecipePreviewList,
  },
  data() {
    return {
      favRecipes: [],
    };
  },
  async mounted() {
    this.fetchFavoriteRecipes();
  },
  methods: {
    async fetchFavoriteRecipes() {
      try {
        this.favRecipes = await getRecipeInFavorites();
      } catch (error) {
        console.error("Error fetching favorite recipes:", error);
      }
    },
    async handleLikedChanged(recipeId, isLiked) {
      try {
        console.log("Event Triggered At Favorites");
        if (!isLiked) {
          // Remove the recipe from favorites immediately
          await unMarkAsFavorite(recipeId);
          this.favRecipes = this.favRecipes.filter((recipe) => recipe.id !== recipeId);
        } else {
          // Add the recipe to favorites
          await markAsFavorite(recipeId);
          // Optionally fetch updated favorites list
          this.favRecipes = await getRecipeInFavorites();
        }
      } catch (error) {
        console.error("Error handling liked changed:", error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* Optional: Adjust styling as needed */
</style>
