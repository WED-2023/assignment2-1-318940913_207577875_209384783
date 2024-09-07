<template>
  <!-- Container with hover effects that toggle the isHovered state -->
  <div class="recipe-preview-container" @mouseover="isHovered = true" @mouseleave="isHovered = false">
    <!-- Link to specific recipe making or viewing page based on whether it's part of a meal plan -->
    <router-link v-if="meal" :to="{ name: 'RecipeMaking', params: { recipeId: recipe.id } }" class="recipe-preview">
      <div class="recipe-image-container">
        <!-- Displays recipe image if it has successfully loaded -->
        <b-card v-if="image_load" :img-src="recipe.image" img-alt="Recipe Image" tag="article" class="recipe-image"></b-card>
      </div>
      <div class="recipe-footer">
        <!-- Displays recipe title and conditionally styles if recipe has been viewed -->
        <div class="recipe-title" :class="{ 'viewed': hasViewedRecipe }">{{ recipe.title }}</div>
        <!-- Displays recipe details like cooking time and likes -->
        <ul class="recipe-overview">
          <li><i class="fas fa-clock"></i> {{ recipe.readyInMinutes }} minutes</li>
          <li><i class="bi bi-heart-fill"></i> {{ recipe.aggregateLikes }} likes</li>
        </ul>
      </div>
    </router-link>
    <router-link v-else :to="{ name: 'recipe', params: { recipeId: recipe.id } }" class="recipe-preview">
      <div class="recipe-image-container">
        <b-card v-if="image_load" :img-src="recipe.image" img-alt="Recipe Image" tag="article" class="recipe-image"></b-card>
      </div>
      <div class="recipe-footer">
        <div class="recipe-title" :class="{ 'viewed': hasViewedRecipe }">{{ recipe.title }}</div>
        <ul class="recipe-overview">
          <li><i class="fas fa-clock"></i> {{ recipe.readyInMinutes }} minutes</li>
          <li><i class="bi bi-heart-fill"></i> {{ recipe.aggregateLikes }} likes</li>
        </ul>
      </div>
    </router-link>
    <!-- Displays additional icons for dietary preferences if applicable -->
    <div class="recipe-type-Like">
      <ul class="d-flex align-items-center list-unstyled mb-0">
        <!-- RecipeLike component handles liking functionality, passing hover state and handling liked changes -->
        <li class="like-container" v-if="$root.store.username">
          <RecipeLike :recipe="recipe" :is-hovered="isHovered" @likedChanged="handleLikedChanged"></RecipeLike>
        </li>
        <li v-if="recipe.vegetarian" v-b-tooltip.hover title="Vegetarian">
          <i class="fas fa-seedling text-success"></i>
        </li>
        <li v-if="recipe.vegan" v-b-tooltip.hover title="Vegan">
          <i class="fas fa-leaf text-success"></i>
        </li>
        <li v-if="recipe.glutenFree" v-b-tooltip.hover title="Gluten Free">
          <i class="fas fa-bread-slice"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import RecipeLike from "@/components/RecipeLike.vue"; // Component for like functionality

export default {
  components: {
    RecipeLike
  },
  data() {
    return {
      image_load: true, // Flag to check if image is loaded
      isLiked: false, // State to track if the recipe is liked
      hasViewedRecipe: false, // State to track if the recipe has been viewed
      isHovered: false // State to track if the recipe preview is being hovered
    };
  },
  props: {
    recipe: {
      type: Object,
      required: true // Recipe object must be provided
    },
    meal: {
      type: Boolean,
      default: false // Indicates if the recipe is part of a meal
    },
  },
  mounted() {
    this.checkIfViewed(); // Check if the recipe has been viewed on mount
  },
  watch: {
    '$root.store.username': function() {
      this.checkIfViewed(); // Re-check viewed state when username changes
    }
  },
  methods: {
    handleLikedChanged(recipeId, isLiked) {
      // Handles liked state changes, emits an event for parent handling
      this.$emit("likedChanged", recipeId, isLiked);
    },
    async checkIfViewed() {
      // Checks if the recipe has been viewed by the current user
      if(this.$root.store.username) {
        const response = await checkLastViewedRecipesFromServer(this.recipe.id);
        this.hasViewedRecipe = response;
      }
    }
  }
}
</script>

<style scoped>
/* Container styling for the recipe preview, including borders, shadow, and sizing */
.recipe-preview-container {
  width: 100%; /* Full width of the container */
  padding: 10px; /* Padding around the content for spacing */
  border: 1px solid #ddd; /* Light gray border for distinction */
  border-radius: 8px; /* Rounded corners for a softer look */
  margin-bottom: 20px; /* Space below each recipe preview */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  max-height: 350px; /* Maximum height of the container */
  min-height: 350px; /* Minimum height to maintain consistency */
  max-width: 150px; /* Maximum width for mobile views */
  min-width: 340px; /* Minimum width to ensure content fits */
}
  /* Adds a light gray background color on hover for visual feedback */
.recipe-preview-container:hover
{
  background-color: rgba(241, 240, 240);
}

/* Styling for the link element wrapping the recipe details */
.recipe-preview {
  display: block; /* Ensures it behaves as a block for better clickability */
  text-decoration: none; /* Removes underline from the link */
  color: inherit; /* Inherits the text color from parent elements */
}

/* Container for the image to ensure it does not overflow its boundary */
.recipe-image-container {
  overflow: hidden; /* Hides anything outside the boundary of the container */
  height: 200px; /* Fixed height for the image container */
}

/* Styling for the image itself to ensure it covers the available space */
.recipe-image {
  width: 100%; /* Ensures the image covers the full width of its container */
  height: 100%; /* Ensures the image covers the full height of its container */
}

/* Footer section containing the recipe title and overview */
.recipe-footer {
  padding: 10px 0; /* Vertical padding for spacing around the content */
}

/* Styling for the recipe title with emphasis */
.recipe-title {
  font-size: 18px; /* Larger font size for title */
  font-weight: bold; /* Bold text for emphasis */
  margin-bottom: 10px; /* Space below the title */
  display: flex; /* Utilizes flexbox for alignment */
  justify-content: center; /* Centers the title text horizontally */
}

/* Styling for the recipe overview, containing icons and text */
.recipe-overview {
  display: flex; /* Utilizes flexbox for layout */
  justify-content: space-between; /* Distributes space evenly between items */
  margin: 0 50px; /* Horizontal margins for padding from the container edges */
}

/* List items within the recipe overview */
.recipe-overview li {
  display: flex; /* Displays list items as flex containers */
  align-items: center; /* Centers items vertically within the list item */
  font-size: 14px; /* Smaller font size for subtlety */
  gap: 4px; /* Space between icon and text */
}

/* Container for like icons and dietary preference indicators */
.recipe-type-Like {
  display: flex; /* Utilizes flexbox for layout */
  justify-content: space-between; /* Distributes space evenly between items */
  align-items: center; /* Aligns items vertically at the center */
}

/* Styling for the unordered list within the like and dietary preferences container */
.recipe-type-Like ul {
  display: flex; /* Displays items in a row */
  align-items: center; /* Centers items vertically */
  list-style-type: none; /* Removes bullet points */
  padding: 0; /* Removes padding */
}
</style>

