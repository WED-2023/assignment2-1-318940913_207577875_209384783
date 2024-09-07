<template>
  <div class="container mt-4">
    <div v-if="recipe" class="card">
      <div class="card-header text-center">
        <h5>{{ recipe.title }}</h5>
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
                {{ calculateAdjustedAmount(r) }} {{ r.unit }}
                {{ r.originalName }}
              </li>
            </ul>
          </div>
          <div class="col-md-6">
            <h5>Instructions</h5>
            <ol class="list-group list-group-flush instructions-list">
              <li
                v-for="(s, index) in recipe.instructions"
                :key="index"
                class="list-instruction-item"
              >
                <input
                  type="checkbox"
                  v-model="checkedInstructions[index]"
                  class="instruction-checkbox"
                />
                <span :class="{ 'checked-text': checkedInstructions[index] }">{{
                  s
                }}</span>
              </li>
            </ol>
            <div class="mt-1">
              <b-button
                class="mr-1"
                size="sm"
                variant=""
                @click="resetAllRecipeProgress"
                style="border-radius: 5px;"
                >Clear</b-button
              >
              <b-button
                size="sm"
                variant="success"
                @click="markAsDone"
                style="border-radius: 5px;"
                >Mark As Done</b-button
              >
            </div>
            <div class="mt-3">
              <h5>Recipe Progress</h5>
              <b-progress
                :value="checkedCount"
                :max="recipe.instructions.length"
                variant="success"
                animated
                show-progress
              >
                <b-progress-bar :value="checkedCount">
                  <strong
                    >{{ checkedCount }} /
                    {{ recipe.instructions.length }}</strong
                  >
                </b-progress-bar>
              </b-progress>
            </div>
            <div class="mt-3">
              Choose Serving Amount:
              <br />
              <b-form-spinbutton
                id="sb-inline"
                v-model="recipe.servings"
                inline
                @change="handleServingsChange"
              ></b-form-spinbutton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mockGetRecipeFullDetails } from "../services/recipes.js";
import { getRecipeFullPage } from "@/services/recipes.js";
import { getRecipeProgress, setRecipeProgress } from "@/services/user.js";

// Utility function to debounce a function call
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export default {
  name: "RecipeMaking",
  data() {
    return {
      recipe: null,
      recipeId: this.$route.params.recipeId,
      checkedInstructions: [],
      originalServings: 0,
    };
  },
  computed: {
    checkedCount() {
      return this.checkedInstructions.filter(Boolean).length;
    },
  },
  methods: {
    markAsDone() {
      this.checkedInstructions = this.checkedInstructions.map(() => true);
      this.saveProgress();
    },
    calculateAdjustedAmount(ingredient) {
      return ingredient.amount * (this.recipe.servings / this.originalServings);
    },
    async fetchRecipeDetails() {
      try {
        const response = await getRecipeFullPage(this.recipeId);
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
          id,
        };
        this.originalServings = this.recipe.servings;

        // Load saved progress or initialize if none
        this.checkedInstructions =
          (await getRecipeProgress(this.recipe.id)) ||
          this.recipe.instructions.map(() => false);
        if (this.checkedInstructions.length === 0)
          this.checkedInstructions = this.recipe.instructions.map(() => false);
      } catch (error) {
        console.log(error);
        this.$router.replace("/NotFound");
      }
    },
    handleServingsChange() {
      this.recipe.extendedIngredients.forEach((ingredient) => {
        this.$set(
          ingredient,
          "adjustedAmount",
          this.calculateAdjustedAmount(ingredient)
        );
      });
    },
    resetAllRecipeProgress() {
      this.checkedInstructions = this.checkedInstructions.map(() => false);
      this.saveProgress();
    },
    // Debounced saveProgress method
    saveProgress: debounce(async function() {
      await setRecipeProgress({
        recipeId: this.recipeId,
        recipe_progress: this.checkedInstructions,
      });
    }, 300),
  },
  watch: {
    // Watch changes in checkedInstructions and debounce the save function
    checkedInstructions: {
      handler: debounce(async function() {
        await setRecipeProgress({
          recipeId: this.recipeId,
          recipe_progress: this.checkedInstructions,
        });
      }, 300),
      deep: true, // Ensure deep watching for array elements
    },
  },
  async created() {
    await this.fetchRecipeDetails();
  },
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
  margin-left: 20px;
  position: relative;
}

.list-instruction-item {
  border: none;
  padding-left: 0;
  position: relative;
}

.ingredients-list {
  list-style-type: none;
  padding-left: 0;
}

.ingredients-list li:before {
  content: "\2022";
  color: #00ff00;
  font-size: 1.5em;
  margin-right: 5px;
  position: absolute;
  left: -20px;
  top: 5px;
}

.instructions-list {
  list-style-type: none;
  padding-left: 0;
}

.instructions-list li:before {
  font-size: 1.5em;
  margin-right: 5px;
  position: absolute;
  left: -20px;
  top: 5px;
}

.instruction-checkbox {
  margin-right: 10px;
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
  text-decoration: line-through;
}

[data-toggle="tooltip"] {
  cursor: default;
}

#override h5 {
  font-size: 18px;
  color: #333;
  margin-bottom: 5px;
  border-bottom: 2px solid #42b983;
  padding-bottom: 10px;
}
</style>
