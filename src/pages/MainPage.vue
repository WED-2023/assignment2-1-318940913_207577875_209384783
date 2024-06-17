<template>
  <div>
    <b-row>
      <!-- Left Column - Random Recipes -->
      <b-col cols="12" md="6" lg="6">
        <div class="random-column">
          <div class="recipe-preview-container">
            <h3 class="mb-4">Explore these Recipes</h3>

            <!-- First Row: Two recipes -->
            <b-row v-if="randomRecipes.length >= 2">
              <b-col v-for="recipe in firstRowRecipes" :key="recipe.id" cols="12" md="6" lg="6" >
                <RecipePreview :recipe="recipe" />
              </b-col>
            </b-row>
            <!-- Second Row: One recipe -->
            <b-row v-if="randomRecipes.length >= 3">
              <b-col :key="randomRecipes[2].id" cols="12" md="12" lg="12">
                <RecipePreview :recipe="randomRecipes[2]" />
              </b-col>
            </b-row>
          </div>
          <div class="random-button-container">
            <b-button id="random-button" @click="handleRandomize" variant="primary"><i class="bi bi-shuffle"></i> Explore More Recipes</b-button>
          </div>
        </div>
      </b-col>

      <!-- Right Column - Last Viewed Recipes / Login -->
      <b-col cols="12" md="6" lg="6">
        <div class="d-flex justify-content-center">
          <div v-if="$root.store.username" class="container-user">
            <h3 class="mb-4">Last Viewed Recipes</h3>
            <b-row v-if="lastUserRecipes.length >= 2" >
              <b-col v-for="recipe in firstRowRecipesUser" :key="recipe.id" cols="12" md="6" lg="6" >
                <RecipePreview :recipe="recipe"   />
              </b-col>
            </b-row>
            <!-- Second Row: One recipe -->
            <b-row v-if="lastUserRecipes.length >= 3">
              <b-col :key="lastUserRecipes[2].id" cols="12" md="12" lg="12">
                <RecipePreview :recipe="lastUserRecipes[2]" />
              </b-col>
            </b-row>
            <!-- <RecipePreviewList :recipes="lastUserRecipes" title="Last Viewed Recipes" class="RandomRecipes center"/> -->
          </div>
          <div v-else class="login-container">
            <LoginPage />
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import RecipePreviewList from "@/components/RecipePreviewList.vue";
import RecipePreview from "@/components/RecipePreview.vue"; // Replace with actual path
import LoginPage from "@/pages/LoginPage.vue";
import { mockGetAllRecipesPreview, mockGetRecipesPreview } from "../services/recipes.js"; // Adjust import paths as necessary

export default {
  data() {
    return {
      randomRecipes: [],
      lastUserRecipes: []
    };
  },
  components: {
    RecipePreviewList,
    LoginPage,
    RecipePreview
  },
  mounted() {
    this.fetchRandomRecipes();
    if (this.$root.store.username) {
      this.fetchLastViewedRecipes(3);
    }
  },
  watch: {
    '$root.store.username': function(newVal) {
      if (newVal) {
        this.fetchLastViewedRecipes(3);
      }
    }
  },
  methods: {
    fetchRandomRecipes() {
      const response = mockGetAllRecipesPreview(); // Mock data for all recipes
      const allRecipes = response.data.recipes;
  
      // Shuffle the array of recipes to get a random order
      const shuffledRecipes = this.shuffleArray(allRecipes);
  
      // Slice the shuffled array to get the first 3 recipes
      this.randomRecipes = shuffledRecipes.slice(0, 3);
    },
    fetchLastViewedRecipes(amountToFetch) {
      const response = mockGetRecipesPreview(amountToFetch); // Mock data for last viewed recipes
      this.lastUserRecipes = response.data.recipes;
    },
    handleRandomize() {
      this.fetchRandomRecipes(); // Fetch new random recipes
    },
    shuffleArray(array) {
      // Function to shuffle array items randomly
      let currentIndex = array.length;
      let temporaryValue, randomIndex;
    
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
    
      return array;
    }
  },
  computed: {
    firstRowRecipes() {
      return this.randomRecipes.slice(0, 2); // First two recipes for first row
    },
    firstRowRecipesUser() {
      return this.lastUserRecipes.slice(0, 2); // First two recipes for first row
    }
  }
};
</script>

<style scoped>
/* .random-column {
  margin-top: 50px;
} */

.random-button-container {
  margin-top: 20px;
  text-align: center;
}

.container-user, .login-container {
  width: 100%;
  max-width: 100%;
}

.login-container {
  padding: 20px;
  text-align: center;
}

.recipe-preview-container {
  margin-top: 20px;
}
</style>
