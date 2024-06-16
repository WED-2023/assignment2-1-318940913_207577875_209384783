<template>
  <div class="container">
    <b-row>
      <!-- Left Column -->
      <b-col cols="12" md="6">
        <!-- Random Recipes List -->
        <RecipePreviewList title="Explore these Recipes" :recipes="randomRecipes"/>
        <div class="random-button-container"><b-button id="random-button">Random</b-button></div>
      </b-col>
      <!-- Right Column -->
      <b-col cols="12" md="6">
        <!-- Show Last Viewed Recipes if user is logged in -->
        <div v-if="$root.store.username" class="container-user">
          <RecipePreviewList :recipes="lastUserRecipes" title="Last Viewed Recipes" class="RandomRecipes center"/> </div>
        <!-- Show LoginPage if user is not logged in -->
        <div v-else class="login-container">
          <LoginPage />
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import RecipePreviewList from "@/components/RecipePreviewList.vue";
import LoginPage from "@/pages/LoginPage.vue";
import { mockGetRecipesPreview } from "../services/recipes.js"; 

export default {

  data() {
    return {
      randomRecipes: [], 
      lastUserRecipes: [] 
    };
  },
  components: {
    RecipePreviewList,
    LoginPage
  },
  mounted() {
    this.fetchRandomRecipes(3);
    if (this.$root.store.username)
    {
      this.fetchLastViewedRecipes(3);}
  },
  watch: {
    '$root.store.username': function(newVal) {
      if (newVal) {
        this.fetchLastViewedRecipes(3);
      }
    }
  },
  methods: {
    fetchRandomRecipes(amountToFetch){
      const response = mockGetRecipesPreview(amountToFetch);
      this.randomRecipes = response.data.recipes;},
    fetchLastViewedRecipes(amountToFetch){
      const response = mockGetRecipesPreview(amountToFetch);
      this.lastUserRecipes = response.data.recipes;}
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
