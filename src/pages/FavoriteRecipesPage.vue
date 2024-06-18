<template>
  <div>
      <RecipePreviewList title="My Favorites" :recipes="favRecipes"></RecipePreviewList>  
  </div>
</template>

<script>
  import RecipePreviewList from "@/components/RecipePreviewList.vue";
  import { mockGetRecipeFullDetails } from "../services/recipes.js"; 
  export default {
      data() {
          return {
          favRecipes: [], 
          };
      },
      components: {
          RecipePreviewList,
      },
      mounted() {
          this.fetchFavoriteRecipes();
      },
      methods: {
          fetchFavoriteRecipes()
          {
              // this.favRecipes = [];
              const username = this.$root.store.username; 
              const userMeals = this.$root.store.getUserFavorites(username);
              for (const recipeID of userMeals)
              {
                  const response = mockGetRecipeFullDetails(recipeID);
                  this.favRecipes.push(response.data.recipe);
              }
          }
      }
  }
</script>

<style lang="scss" scoped>

</style>