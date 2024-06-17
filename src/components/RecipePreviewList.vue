<template>
  <b-container>
    <h3 class="mb-4">{{ title }} :</h3>
    <b-row>
      <draggable v-if="meal" v-model="recipes" tag="div" class="row" group="recipesGroup" @end="onDragEnd">
        <b-col v-for="(recipe, index) in recipes" :key="recipe.id" cols="12" sm="6" md="6" lg="4">
          <RecipeInMealPreview class="recipePreview" :recipe="recipe" @remove="removeRecipe(index)" />
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
    <div v-if="meal">
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
      required: true
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
    }
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
}

</style>
