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
              <i class="fas fa-utensils"></i> {{ recipe.servings }} Servings
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <h5>Ingredients</h5>
              <ul class="list-group list-group-flush ingredients-list">
                <li
                  v-for="(r, index) in recipe.extendedIngredients"
                  :key="index + '_' + r.id"
                  class="list-group-item"
                >
                  {{ calculateAdjustedAmount(r) }} {{ r.unit }} {{ r.originalName }}
                </li>
              </ul>
            </div>
            <div class="col-md-6">
              <h5>Instructions</h5>
              <ol class="list-group list-group-flush instructions-list">
                <li v-for="(s, index) in recipe.instructions" :key="index" class="list-instruction-item">
                  <input type="checkbox" v-model="checkedInstructions[index]" class="instruction-checkbox"/>
                  <span :class="{ 'checked-text': checkedInstructions[index] }">{{ s }}</span>
                </li>
              </ol>
              <div class="mt-3">
                <h5>Recipe Progress</h5>
                <b-progress :value="checkedCount" :max="recipe.instructions.length" variant="success" animated show-progress>
                  <b-progress-bar :value="checkedCount">
                    <strong>{{ checkedCount }} / {{ recipe.instructions.length }}</strong>
                  </b-progress-bar>
                </b-progress>
              </div>
              <div class="mt-3">
                Choose Serving Amount:
                <br>
                <b-form-spinbutton id="sb-inline" v-model="recipe.servings" inline @change="handleServingsChange"></b-form-spinbutton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mockGetRecipeFullDetails } from "../services/recipes.js";
  
  export default {
    name: "RecipeMaking",
    data() {
      return {
        recipe: null,
        checkedInstructions: [],
        originalServings: 0 // Initialize originalServings
      };
    },
    computed: {
      checkedCount() {
        return this.checkedInstructions.filter(Boolean).length;
      }
    },
    methods: {
      calculateAdjustedAmount(ingredient) {
        return ingredient.amount * (this.recipe.servings / this.originalServings);
      },
      async fetchRecipeDetails() {
        try {
          const response = await mockGetRecipeFullDetails(this.$route.params.recipeId);
          console.log("response.status", response.status);
          if (response.status !== 200) this.$router.replace("/NotFound");
  
          const {
            instructions,
            extendedIngredients,
            readyInMinutes,
            image,
            title,
            servings,
            summary
          } = response.data.recipe;
  
          this.recipe = {
            instructions,
            extendedIngredients,
            readyInMinutes,
            image,
            title,
            servings,
            summary
          };
  
          this.originalServings = this.recipe.servings;
          // Initialize checkedInstructions
          this.checkedInstructions = instructions.map(() => false);
  
        } catch (error) {
          console.log(error);
          this.$router.replace("/NotFound");
        }
      },
      handleServingsChange() {
        // Update ingredient amounts based on new servings
        this.recipe.extendedIngredients.forEach(ingredient => {
          this.$set(ingredient, 'adjustedAmount', this.calculateAdjustedAmount(ingredient));
        });
      }
    },
    async created() {
      await this.fetchRecipeDetails();
    }
  };
  </script>
  

<style lang="scss" scoped>

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

.list-instruction-item {
  border: none;
  padding-left: 0;
  position: relative;
}

.ingredients-list {
  list-style-type: none;
  padding-left: 0; /* Reset padding to 0 to apply custom padding */
}

.ingredients-list li:before {
  content: "\2022"; /* Unicode character for bullet (•) */
  color: #00ff00; /* Custom color */
  font-size: 1.5em; /* Adjust size if needed */
  margin-right: 5px; /* Space between bullet and text */
  position: absolute;
  left: -20px; /* Adjust based on your design */
  top:5px;
}

.instructions-list {
  list-style-type: none;
  padding-left: 0; /* Reset padding to 0 to apply custom padding */
}

.instructions-list li:before {
  font-size: 1.5em; /* Adjust size if needed */
  margin-right: 5px; /* Space between bullet and text */
  position: absolute;
  left: -20px; /* Adjust based on your design */
  top:5px;
}

.instruction-checkbox {
  margin-right: 10px; /* Space between checkbox and text */
}

.fas {
  margin-right: 5px;
}

.d-inline-block.ml-auto {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.checked-text {
  text-decoration: line-through; /* Strike-through for checked instructions */
}

[data-toggle="tooltip"] {
  cursor: default
}

</style>