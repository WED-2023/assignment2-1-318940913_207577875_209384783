<template>
  <div class="table">
    <b-row class="row-container">
      <!-- Left Column - Random Recipes -->
      <b-col lg="5">
        <div class="random-column">
          <div class="recipe-preview-container">
            <h3 class="mb-4">Discover New Culinary Adventures</h3>
            <!-- First Row: Two recipes -->
            <b-row v-if="randomRecipes.length >= 2" >
              <b-col v-for="recipe in firstRowRecipes" :key="recipe.id" lg="6"  >
                <RecipePreview :recipe="recipe" />
              </b-col>
            </b-row>
            <!-- Second Row: One recipe -->
            <b-row v-if="randomRecipes.length >= 3">
              <b-col :key="randomRecipes[2].id" lg="12" class="recipe-row-two">
                <RecipePreview :recipe="randomRecipes[2]" />
              </b-col>
            </b-row>
          </div>
          <div class="random-button-container">
            <b-button id="random-button" @click="handleRandomize" variant="primary" class="random-button"><i class="bi bi-shuffle"></i> Explore More Recipes</b-button>
          </div>
        </div>
      </b-col>
      <!-- Right Column - Last Viewed Recipes / Login -->
      <b-col lg="5">
        <div class="login-last-viewed">
          <div v-if="$root.store.username" class="container-user">
            <h3 class="mb-4">Recipes You've Recently Seen</h3>
            <b-row v-if="lastUserRecipes.length >= 1" >
              <b-col v-for="recipe in firstRowRecipesUser" :key="recipe.id"  lg="6" >
                <RecipePreview :recipe="recipe"   />
              </b-col>
            </b-row>
            <!-- Second Row: One recipe -->
            <b-row v-if="lastUserRecipes.length >= 3">
              <b-col :key="lastUserRecipes[2].id" lg="12" class="recipe-row-two">
                <RecipePreview :recipe="lastUserRecipes[2]" />
                
              </b-col>
            </b-row>
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
import RecipePreview from "@/components/RecipePreview.vue"; 
import LoginPage from "@/pages/LoginPage.vue";
import { mockGetAllRecipesPreview, mockGetRecipesPreview,mockGetRecipePreviewById } from "../services/recipes.js"; 

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
      this.fetchRandomRecipes();
      this.fetchLastViewedRecipes();
    }
  },
  watch: {
    '$root.store.username': function(newVal) {
      if (newVal) {
        this.fetchLastViewedRecipes();
      }
    }
  },
  methods: {
    fetchRandomRecipes() {
      const response = mockGetAllRecipesPreview();
      const allRecipes = response.data.recipes;
        const shuffledRecipes = this.shuffleArray(allRecipes);
        this.randomRecipes = shuffledRecipes.slice(0, 4);

    },
    fetchLastViewedRecipes() {
      this.lastUserRecipes=[];
      const username = this.$root.store.username; 
      const seenByUser = this.$root.store.getUserseenBy(username);
      console.log("seenByUser : ",seenByUser);
      if(seenByUser.length >0)
      {
        for (let i = seenByUser.length - 1; i >= 0; i--) {
        const recipeID = seenByUser[i];
        const response = mockGetRecipePreviewById(recipeID);
        this.lastUserRecipes.push(response.data.recipe);
        }
      }
    },
    handleRandomize() {
      this.fetchRandomRecipes(); 
    },
    shuffleArray(array) {
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
      return this.randomRecipes.slice(0, 2); 
    },
    firstRowRecipesUser() {
      return this.lastUserRecipes.slice(0, 2); 
    }
  }
};
</script>

<style  scoped>
.random-column {
  padding: 20px;
  border-radius: 8px;
}

.login-last-viewed {
  padding: 20px;
  border-radius: 8px;
  margin-left: 30px;
}

.recipe-row-two {
  margin-top: 20px;
  margin-left: 180px;
}

.random-button-container {
  margin-top: 20px;
}

.login-container {
  padding: 20px;
  text-align: center;
}

.bi-shuffle {
  font-size: 1.4rem;
}

.mb-4 {
  font-weight: bold;
  font-size: 1.8rem;
  display: inline-block;
  border-bottom: 2px solid #42b983;
  margin-left: 140px;
}

.random-button {
  font-size: 1.6rem;
  margin-left: 180px;
}

.row-container[data-v-54d5bc8c] {
    width: 90%;
    margin: 0% 25% 0% 8%;
}
</style>
