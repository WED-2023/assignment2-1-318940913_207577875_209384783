<template>
  <div>
      <RecipePreviewList title="My Recipes" :recipes="myRecipes"></RecipePreviewList>  
  </div>
  </template>
  
  <script>
  import RecipePreviewList from "@/components/RecipePreviewList.vue";
  import { mockGetRecipeFullDetails } from "../services/recipes.js"; 
  
  export default {
  data() {
      return {
      myRecipes: [], 
      };
  },
  components: {
      RecipePreviewList,
  },
  mounted() {
      this.fetchFavoriteRecipes();
  },
  methods: {
      handleDocumentClick(event) {
      // Ensure the event is from a valid source if necessary
      this.fetchFavoriteRecipes();
      },
      async fetchFavoriteRecipes() {
          this.myRecipes = [];
          const username = this.$root.store.username; 
          const userRecipes = this.$root.store.getUserMyRecipes(username);
  
          for (const recipeID of userRecipes) {
              const response = mockGetRecipeFullDetails(recipeID, true);
              if (response && response.data && response.data.recipe) {
              this.myRecipes.push(response.data.recipe);
              }
          }
      }
  }
  }
  </script>
  
  <style lang="scss" scoped>
  
  </style>
    