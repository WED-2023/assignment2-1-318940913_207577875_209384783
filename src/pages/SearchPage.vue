<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Search Recipes</h1>
    
    <div class="row mb-4">
      <div>
        <b-input-group size="lg" class="mb-3" prepend="Search" style="width: 800px;">
          <b-form-input v-model="searchQuery"></b-form-input>
          <b-input-group-append><b-button size="sm" text="Button" variant="success" @click="performSearch"><i class="fas fa-search"></i></b-button> </b-input-group-append>
        </b-input-group>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-4">
      <b-button v-b-toggle.filters-sidebar variant="primary"><i class="bi bi-filter"> Filters</i></b-button>
    </div>

      <div class="sort-options d-flex align-items-center justify-content-between mb-4">
        <div class="form-group">
          <label for="resultsCount" class="me-2">Results per Page:</label>
          <select id="resultsCount" v-model="resultsCount" class="form-select-result">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="15">15</option>
          </select>
        </div>
        <div class="form-group">
          <label for="sortBy" class="me-2">Sort by:</label>
          <select id="sortBy" v-model="sortBy" class="form-select-sort">
            <option value="time">Time</option>
            <option value="popularity">Popularity</option>
            <option value="healthiness">Healthiness</option>
            <option value="calories">Calories</option>
            <!-- <option value="popularityDesc">Popularity (High to Low)</option> -->
          </select>
        </div>
      </div>
    </div>
    <b-sidebar id="filters-sidebar" title="Filters" right >
      <div class="mb-3">
        <h5>Cuisines</h5>
        <div v-for="cuisine in cuisines" :key="cuisine">
          <b-form-checkbox v-model="filters.selectedCuisines" :value="cuisine">{{ cuisine }}</b-form-checkbox>
        </div>
      </div>
      <div class="mb-3">
        <h5>Diets</h5>
        <div v-for="diet in diets" :key="diet">
          <b-form-checkbox v-model="filters.selectedDiets" :value="diet">{{ diet }}</b-form-checkbox>
        </div>
      </div>
      <div class="mb-3">
        <h5>Intolerances</h5>
        <div v-for="intolerance in intolerances" :key="intolerance">
          <b-form-checkbox v-model="filters.selectedIntolerances" :value="intolerance">{{ intolerance }}</b-form-checkbox>
        </div>
      </div>
    </b-sidebar>
  <b-col cols="12">
      <div v-if="recipes.length === 0 && searchQuery && !$root.store.username" class="text-center mt-3">
        <p>No results found.</p>
      </div>
      <RecipePreviewList v-else-if="recipes.length > 0" title="The search results of the recipes" :recipes="recipes"/>
      <div v-else-if="!searchQuery && !$root.store.username" class="text-center mt-3">
        <p>Start searching to see recipes.</p>
      </div>
      <div v-else-if="$root.store.username && searchQuery && recipes.length === 0  ">
        <p class="text-center mt-3">No results found for your search.</p>
      </div>
      <div v-else-if="$root.store.username">
        <RecipePreviewList title="Your recently viewed recipes" :recipes="lastViewedRecipes"/>
      </div>
    </b-col>
  </div>
</template>

<script>
import { mockGetAllRecipesPreview,mockGetRecipesPreview,getSearchResultsFromServer } from "../services/recipes.js";
import cuisines from '../assets/cuisines.json';
import diets from '../assets/diets.json';
import intolerances from '../assets/intolerances.json';
import RecipePreviewList from "@/components/RecipePreviewList.vue";

export default {
  components:{
    RecipePreviewList
  },

  watch: {
    '$route.query.q': function(newQuery) {
      // this.searchQuery = newQuery;
      // this.performSearch();
    },
    // sortBy() {this.handleSortOptionChange();},
    resultsCount(newVal, oldVal) {if (newVal !== oldVal) {this.performSearch();} },
    sortBy(newVal, oldVal) {if (newVal !== oldVal) {this.performSearch();} }
    // filters: {
    //   handler() {this.performSearch();},
    //   deep: true
    // },
    // searchQuery() {this.performSearch();},
  },
  created() {

  
  },

  data() {
    return {
      recipes: [],
      sortBy: 'time',
      searchQuery: this.$route.query.q ||  "",
      resultsCount: 5,
      filters: {
        selectedCuisines: [],
        selectedDiets: [],
        selectedIntolerances: []
      },
      cuisines: cuisines,
      diets: diets,
      intolerances: intolerances,
      lastViewedRecipes: [],
      connectedUser: false,
    };
  },

  methods: {
  async performSearch() {
    const cuisines = this.filters.selectedCuisines.join(',');
    const diets = this.filters.selectedDiets.join(',');
    const intolerances = this.filters.selectedIntolerances.join(',');
    const response = await getSearchResultsFromServer(this.searchQuery,cuisines,diets,intolerances,this.resultsCount,this.sortBy);
    this.recipes = response;
  }
  },
  
};
</script>

<style scoped>

h1 {
  color: #333;
  font-weight: bold;
}

.btn-primary {
  margin-left: 25px;
  background-color: gray;
  border-color: gray;
}

.btn-primary:hover {
  background-color: rgb(96, 96, 96);
  border-color: rgb(96, 96, 96);
}
::v-deep .b-sidebar {
  position: fixed;

  padding: 10px;
  border-radius: 10px;
  margin-top: 60px;
}

::v-deep .b-sidebar-header button {
  order: 2; 
  margin-left: 60%;
}

::v-deep .b-sidebar-header .b-sidebar-title {
  order: 1; 
}
h5, .h5{
  font-size: 1.5rem;
}
.bi-filter {
  font-size: 1.4rem; 
}

.form-select-result {
  width: 50px; 
  margin-right: 20px;
}
.me-2 {
    margin-right: 15px; 
    font-size: 18px;
  }
</style>
