<template>
  <div class="recipe-search-page">
    <h1>Search Recipes</h1>
    <div class="search-box">
      <input v-model="searchQuery" @input="performSearch" type="text" placeholder="Search for recipes..." />
      <select v-model="resultsCount" @change="performSearch">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
      
    </div>

    <!-- Filters sidebar -->
    <b-sidebar id="filters-sidebar" title="Filters" shadow>
      <!-- Dropdown for Cuisines -->
      <b-col>
        <b-dropdown id="cuisine-filter" text="Cuisines" class="mb-3">
          <div class="cuisines-dropdown-options">
            <b-dropdown-item v-for="(cuisine, index) in cuisines" :key="index">
              <b-form-checkbox v-model="filters.cuisines[cuisine]">{{ cuisine }}</b-form-checkbox>
            </b-dropdown-item>
          </div>
        </b-dropdown>
      </b-col>
      <!-- Dropdown for Diets -->
      <b-col>
        <div class="diets-dropdown">
          <b-dropdown id="diet-filter" text="Diets" class="mb-3">
            <b-dropdown-item v-for="(diet, index) in diets" :key="index">
              <b-form-checkbox v-model="filters.diets[diet]">{{ diet }}</b-form-checkbox>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </b-col>
      <!-- Dropdown for Intolerances -->
      <b-col>
        <div class="intolerances-dropdown">
          <b-dropdown id="intolerance-filter" text="Intolerances" class="mb-3">
            <b-dropdown-item v-for="(intolerance, index) in intolerances" :key="index">
              <b-form-checkbox v-model="filters.intolerances[intolerance]">{{ intolerance }}</b-form-checkbox>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </b-col>
    </b-sidebar>
    <!-- sort options -->
    <div class="sort-options">
      <label>
        Sort by:
        <select placeholder="sortBy" v-model="sortBy" @change="sortResults">
          <option value="time">Preparation Time</option>
          <option value="popularity">Popularity</option>
        </select>
      </label>
    </div>

    <button @click="performSearch" >Search</button>
    <!-- search results -->
    <div class="search-results">
      <p v-if="!recipes.length">No results found.</p>
      <div v-else>
        <div v-for="recipe in recipes" :key="recipe.id" class="recipe-card" @click="goToRecipe(recipe.id)">
          <RecipePreview class="recipePreview" :recipe="recipe"/>
          <h3>{{ recipe.title }}</h3>
          <p>{{ recipe.instructions }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from "../components/RecipePreviewList.vue";
import RecipePreview from "../components/RecipePreview.vue";

import { mockGetRecipesPreview } from "../services/recipes.js";
import cuisines from '../assets/cuisines.json';
import diets from '../assets/diets.json';
import intolerances from '../assets/intolerances.json';
// import Multiselect from 'bootstrap-vue';


export default {
  components:{
    RecipePreviewList,
    RecipePreview,
  },
  data() {
    return {
      recipes: [],
      searchQuery: '',
      resultsCount: 5,
      filters: {
        selectedCuisines: {},
        selectedDiets: {},
        selectedIntolerances: {}
      },
      sortBy: '',
      loading: false,
      cuisines: cuisines,
      diets: diets,
      intolerances: intolerances
      // dan dan dan
      
    };
  },
  computed: {
    sortedRecipes() {
      let sorted = [this.recipes];
      if (this.sortBy === 'time') {
        sorted.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
      } else if (this.sortBy === 'popularity') {
        sorted.sort((a, b) => b.popularity - a.popularity);
      }
      return sorted;
    }
  },
  methods: {
    fetchLastViewedRecipes(amountToFetch) {
      const response = mockGetRecipesPreview(amountToFetch);
      this.recipes = response.data.recipes;
    },
    async performSearch() {
      let filteredRecipes = mockGetRecipesPreview(this.resultsCount);
      if (this.searchQuery) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      if (this.filters.selectedCuisines.length) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          this.filters.selectedCuisines.includes(recipe.cuisine)
        );
      }

      if (this.filters.selectedDiets.length) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          this.filters.selectedDiets.some(diet => recipe.diets.includes(diet))
        );
      }

      if (this.filters.selectedIntolerances.length) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          this.filters.selectedIntolerances.every(intolerance => !recipe.intolerances.includes(intolerance))
        );
      }

      this.recipes = filteredRecipes.slice(0, this.resultsCount);
    },
    sortResults() {
      // Sorting logic is handled by the computed property `sortedRecipes`
    },
    goToRecipe(recipeId) {
      this.$router.push({ name: 'RecipeViewPage', params: { id: recipeId } });
    },
    loadLastSearch() {

    },
  },
  created() {
    this.performSearch();  // Initial search to load some recipes
  }
};
</script>
<style scoped>
.recipe-search-page {
  padding: 20px;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.sort-options {
  margin-bottom: 20px;
}

.search-results {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.recipe-card {
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

.recipe-card img {
  width: 100%;
  border-radius: 8px;
}

.recipe-card h3 {
  font-size: 16px;
  margin: 10px 0;
}

.recipe-card p {
  font-size: 14px;
  color: #555;
}
</style>
