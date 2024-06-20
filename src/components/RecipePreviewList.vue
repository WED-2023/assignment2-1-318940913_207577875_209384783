<template>
  <b-container class="title-container">
    <h3 v-if="title" class="title mb-2">{{ title }}</h3>
    <b-row>
      <draggable v-if="meal" v-model="recipes" tag="div" class="row" group="recipesGroup" @end="onDragEnd">
        <b-col v-for="(recipe, index) in recipes" :key="recipe.id" class="recipe-col">
          <div class="recipe-wrapper">
            <div @click="removeRecipe(index)" class="icon-container">
              <i class="bi bi-trash mb-1 icon-shadow"></i>
            </div>
            <RecipeInMealPreview class="recipePreview" :recipe="recipe" />
          </div>
        </b-col>
        
        <b-col v-if="recipes.length === 0">
          <p>No recipes added to the meal.</p>
        </b-col>
      </draggable>
      <template v-else>
        <b-col v-for="recipe in recipes" :key="recipe.id" cols="12" md="6" lg="4" class="recipe-col">
          <RecipePreview class="recipePreview" :recipe="recipe"/>
        </b-col>
      </template>
    </b-row>
    <div v-if="meal" class="clearMeal">
      <b-button v-if="recipes.length > 0" variant="danger" @click="clearMeal">Clear Meal</b-button>
    </div>
  </b-container>
</template>

<script>
import draggable from 'vuedraggable';
import RecipePreview from "./RecipePreview.vue";
import RecipeInMealPreview from "./RecipeInMealPreview.vue";

export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview,
    RecipeInMealPreview,
    draggable
  },
  props: {
    title: {
      type: String,
      required: false
    },
    recipes: {
      type: Array,
      required: true
    },
    meal: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  methods: {
    onDragEnd(event) {
      // Get the new order of recipe IDs
      const newOrderRecipeIds = this.recipes.map(recipe => recipe.id);
      
      // Call saveRecipesToMeal to save the new order
      this.$root.store.saveRecipesToMeal(this.$root.store.username, newOrderRecipeIds);
    },

    removeRecipe(index) {
      this.recipes.splice(index, 1); // Remove recipe at index
      const recipeIds = this.recipes.map(recipe => recipe.id);
      this.$root.store.saveRecipesToMeal(this.$root.store.username, recipeIds); // Save updated meal
    },

    clearMeal() {
      this.recipes = []; // Clear all recipes from meal
      this.$root.store.saveRecipesToMeal(this.$root.store.username, []); // Save empty meal
    },
  }
};
</script>

<style lang="scss" scoped>
/* Optional: Adjust spacing and layout as needed */
.row {
  margin-bottom: 20px; /* Adjust spacing between rows */
}

.recipe-col {
  margin-bottom: 20px;
  flex-grow: 1; /* Ensure recipes take full width within their column */
}

.recipe-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-container {
  margin-bottom: 10px; /* Adjust vertical spacing between icon and recipe */
  cursor: pointer;
}

.icon-shadow {
  transition: text-shadow 0.3s ease;
}

.icon-shadow:hover {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Adjust shadow properties as needed */
}

.title {
  // font-family: 'Arial', sans-serif; /* You can use any custom font here */
  font-size: 2.5em; /* Adjust the font size as needed */
  background: linear-gradient(to right, #855e41, #855e41); /* Gradient background */
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* Text shadow */
  padding: 10px 20px; /* Padding around the title */
  border-radius: 10px; /* Rounded corners */
  display: inline-block; /* Ensure it doesn't take the full width */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%; /* Adjust the height as needed */
  text-align: center; /* Center text horizontally */
}

.clearMeal {
  text-align: left; /* Center text horizontally */
}

</style>
