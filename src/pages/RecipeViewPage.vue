<template>
  <div class="container mt-4">
    <div v-if="recipe" class="card">
      <div class="card-header text-center">
        <h1 class="card-title">{{ recipe.title }}</h1>
      </div>
      <img :src="recipe.image" class="card-img-top" alt="Recipe Image" />
      <div class="card-body">
        <div class="text-left mb-3">
          <div class="d-inline-block mr-3">
            <i class="fas fa-clock"></i> {{ recipe.readyInMinutes }} Minutes
          </div>
          <div class="d-inline-block mr-3">
            <i class="fas fa-heart red"></i> {{ recipe.aggregateLikes }} Likes
          </div>
          <div class="d-inline-block mr-3">
            <i class="fas fa-utensils"></i> {{ recipe.servings }} Servings
          </div>
          <div class="d-inline-block ml-auto">
            <span v-if="recipe.vegetarian" class="mr-2 green" data-toggle="tooltip" title="Vegetarian">
              <i class="fas fa-seedling text-success"></i>
            </span>
            <span v-if="recipe.vegan" class="mr-2" data-toggle="tooltip" title="Vegan">
              <i class="fas fa-leaf text-success"></i>
            </span>
            <span v-if="recipe.glutenFree" class="mr-2 brown" data-toggle="tooltip" title="Gluten Free">
              <i class="fas fa-bread-slice"></i>
            </span>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <h5>Ingredients</h5>
            <ul class="list-group list-group-flush custom-list">
              <li
                v-for="(r, index) in recipe.extendedIngredients"
                :key="index + '_' + r.id"
                class="list-group-item"
              >
              {{ r.original }}
              </li>
            </ul>
          </div>
          <div class="col-md-6">
            <h5>Instructions</h5>
            <ol class="list-group list-group-flush custom-list">
              <li v-for="(s, index) in recipe.instructions" :key="index" class="list-group-item">
                {{ s }}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center mt-4">
      <router-link :to="{ name: 'RecipeMaking', params: { recipeId: recipe.id } }" class="btn btn-primary">Add To Meal And Start Cook</router-link>
    </div>
    <br>
  </div>
</template>

<script>
import { mockGetRecipeFullDetails } from "../services/recipes.js";

export default {
  name: "recipe",
  data() {
    return {
      recipe: null
    };
  },
  async created() {
    try {
      const response = mockGetRecipeFullDetails(this.$route.params.recipeId);

      console.log("response.status", response.status);
      if (response.status !== 200) this.$router.replace("/NotFound");

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
        id
      } = response.data.recipe;

      // const _instructions = analyzedInstructions
      //   .map((fstep) => {
      //     fstep.steps[0].step = fstep.name + fstep.steps[0].step;
      //     return fstep.steps;
      //   })
      //   .reduce((a, b) => [...a, ...b], []);

      this.recipe = {
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
        id
      };
    } catch (error) {
      console.log(error);
      this.$router.replace("/NotFound");
    }
  }
};
</script>

<style scoped>
.card-img-top {
  max-height: 400px;
  object-fit: cover;
}

.list-group-item {
  border: none;
  padding-left: 0;
  margin-left: 20px; /* Ensure consistent margin for text alignment */
  position: relative;
}

.custom-list {
  list-style-type: none;
  padding-left: 0; /* Reset padding to 0 to apply custom padding */
}

.custom-list li:before {
  content: "\2022"; /* Unicode character for bullet (•) */
  color: #00ff00; /* Custom color */
  font-size: 1.5em; /* Adjust size if needed */
  margin-right: 5px; /* Space between bullet and text */
  position: absolute;
  left: -20px; /* Adjust based on your design */
  top:5px;
}

.fas {
  margin-right: 5px;
}

.d-inline-block.ml-auto {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.brown {
  color: rgb(184, 168, 147)
}

.red {
  color: red
}


[data-toggle="tooltip"] {
  cursor: default
}
</style>
