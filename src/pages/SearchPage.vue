<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Search Recipes</h1>
    
    <div class="row mb-4">
      <!-- <div class="col-md-8">
        <input v-model="searchQuery" type="text" class="form-control" placeholder="Search for recipes..." />
      </div> -->
      <div>
        <b-input-group :size="lg" class="mb-3" prepend="find recipe" style="width: 1000px;">
          <b-form-input></b-form-input>
          <b-input-group-append><b-button size="sm" text="Button" variant="success" @click="performSearch">Search</b-button> </b-input-group-append>
        </b-input-group>
      </div>
      <div class="sort-options">
        <select v-model="resultsCount" class="form-select">
          <option :value="5" >5</option>
          <option :value="10">10</option>
          <option :value="15">15</option>
        </select>
        <label>
         Sort by:
        <select placeholder="sortBy" v-model="sortBy">
          <option value="default">default</option>
          <option value="time">Preparation Time</option>
          <option value="popularity">Popularity</option>
        </select>
      </label>

      </div>
      
    </div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <b-button v-b-toggle.filters-sidebar variant="primary">Toggle Filters</b-button>
    </div>

    <b-sidebar id="filters-sidebar" title="Filters" v-model="showSidebar"    >
      <div class="mb-3">
        <h5>Cuisines</h5>
        <div v-for="cuisine in cuisines" :key="cuisine">
          <b-form-checkbox v-model="filters.selectedCuisines[cuisine]">{{ cuisine }}</b-form-checkbox>
        </div>
      </div>
      <div class="mb-3">
        <h5>Diets</h5>
        <div v-for="diet in diets" :key="diet">
          <b-form-checkbox v-model="filters.selectedDiets[diet]">{{ diet }}</b-form-checkbox>
        </div>
      </div>
      <div class="mb-3">
        <h5>Intolerances</h5>
        <div v-for="intolerance in intolerances" :key="intolerance">
          <b-form-checkbox v-model="filters.selectedIntolerances[intolerance]">{{ intolerance }}</b-form-checkbox>
        </div>
      </div>
    </b-sidebar>
    <b-col cols="12">
    <!-- Check if recipes array is empty -->
    <div v-if="recipes.length === 0" class="text-center mt-3">
      <p>No results found.</p>
    </div>

    <!-- Render RecipePreviewList if recipes array is not empty -->
    <RecipePreviewList v-else title="Recipes" :recipes="recipes"/>
  </b-col>
  </div>
</template>

<script>
import { mockGetAllRecipesPreview } from "../services/recipes.js";
import cuisines from '../assets/cuisines.json';
import diets from '../assets/diets.json';
import intolerances from '../assets/intolerances.json';
import RecipePreviewList from "@/components/RecipePreviewList.vue";
import { mockGetRecipeFullDetails } from "../services/recipes.js";



export default {
  components:{
    RecipePreviewList
  },
  watch: {
    sortBy() {
      this.handleSortOptionChange();
    },
    resultsCount(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.performSearch();
      }
    }

  },

  data() {
    return {
      recipes: [],
      sortBy: 'default',
      searchQuery: "",
      resultsCount: 5,
      filters: {
        selectedCuisines: {},
        selectedDiets: {},
        selectedIntolerances: {}
      },
      cuisines: cuisines,
      diets: diets,
      intolerances: intolerances,
      showSidebar: true
    };
  },
  methods: {
    fetchLastViewedRecipes() {
    const response = mockGetAllRecipesPreview();
    if (response && response.data && Array.isArray(response.data.recipes)) {
      this.recipes = response.data.recipes;
    } else {
      this.recipes = [];
    }
  },
  async performSearch() {
    this.fetchLastViewedRecipes();      

    // Ensure recipes array is valid before proceeding with search and filters
    let filteredRecipes = this.recipes;
    console.log("Filtered Recipes Titles:");
  filteredRecipes.forEach(recipe => {
    console.log(recipe.title);
  });
    console.log('before Filtered recipes length:', filteredRecipes.length);

    if (this.searchQuery) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    console.log('after searchQuery Filtered recipes length:', filteredRecipes.length);

    if (Object.keys(this.filters.selectedCuisines).length>0) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        this.filters.selectedCuisines[recipe.cuisine]
      );
    }
    console.log('after selectedCuisines Filtered recipes length:', filteredRecipes.length);

    if (Object.keys(this.filters.selectedDiets).length>0) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.diets.some(diet => this.filters.selectedDiets[diet])
      );
    }
    console.log('after selectedDiets Filtered recipes length:', filteredRecipes.length);

    if (Object.keys(this.filters.selectedIntolerances).length>0) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        !recipe.intolerances.some(intolerance => this.filters.selectedIntolerances[intolerance])
      );
    }
    console.log('Filtered recipes length:', filteredRecipes.length);

    this.recipes = filteredRecipes.slice(0, this.resultsCount);
    console.log('after slice Filtered recipes length:', this.recipes.length);

  },
    handleSortOptionChange() {
      switch (this.sortBy) {
        case 'default':
          this.recipes.sort(/* Add your default sorting logic */);
          break;
        case 'time':
          this.recipes.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
          break;
        case 'popularity':
          this.recipes.sort((a, b) => b.aggregateLikes - a.aggregateLikes);
          break;
        default:
          break;
      }
    },

  }
};
</script>

<style scoped>

h1 {
  color: #333;
  font-weight: bold;
}
.h5{
  color: #000000;
  font-weight: bold;
}
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

</style>
