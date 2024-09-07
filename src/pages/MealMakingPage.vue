<template>
    <div>
      <!-- Listen for the 'update:recipes' event from the child component -->
      <RecipePreviewList 
        title="My Meal" 
        :recipes="mealRecipes" 
        :meal="true"
        @update:recipes="updateMealRecipes"
      />
    </div>
  </template>
  
  <script>
  import RecipePreviewList from "@/components/RecipePreviewList.vue";
  import { getRecipesInMyMeal } from "@/services/user.js";
  import { getRecipeFullPage } from "@/services/recipes.js";
  
  export default {
    data() {
      return {
        mealRecipes: [], // Initialize meal recipes
      };
    },
    components: {
      RecipePreviewList,
    },
    async mounted() {
      await this.fetchMealRecipes();
    },
    methods: {
      async fetchMealRecipes() {
        // Fetch recipes in the user's meal
        const recipes_in_mymeal = await getRecipesInMyMeal();
        for (const recipe of recipes_in_mymeal) {
          // Fetch full recipe details for each recipe in the meal
          const response = await getRecipeFullPage(recipe.id);
          const {
            instructions,
            extendedIngredients,
            aggregateLikes,
            readyInMinutes,
            image,
            title,
            vegetarian,
            vegan,
            glutenFree,
            servings,
            id,
          } = response.data;
  
          // Create recipe object to add to meal
          const recipeInMeal = {
            instructions,
            extendedIngredients,
            aggregateLikes,
            readyInMinutes,
            image,
            title,
            vegetarian,
            vegan,
            glutenFree,
            servings,
            id,
          };
          
          // Push to mealRecipes
          this.mealRecipes.push(recipeInMeal);
        }
      },
      
      // Handle updates to the meal recipes
      updateMealRecipes(updatedRecipes) {
        this.mealRecipes = updatedRecipes;
        this.$emit('update:recipes', updatedRecipes); // Re-emit the event to the parent
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  
  </style>
  