<template>
    <b-button @click="toggleLike" class="custom-button" :class="{ 'hovered': isHovered }">
      <i :class="isLiked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
    </b-button>
  </template>
  
  <script>
  import { mockAddFavorite } from "../services/user.js";
  import { BButton } from "bootstrap-vue";
  import { isRecipeInFavorites, markAsFavorite, unMarkAsFavorite } from "../services/user.js";
  
  export default {
    components: {
      BButton,
    },
    props: {
      recipe: {
        type: Object,
        required: true,
      },
      isHovered: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        isLiked: false,
      };
    },
    async mounted() {
    try {
      // console.log(`Checking if recipe ${this.recipe.id} is in favorites...`);
      this.isLiked = await isRecipeInFavorites(this.recipe.id);
      // console.log(`Recipe ${this.recipe.id} is in favorites: ${this.isLiked}`);
    } catch (error) {
      console.error(`Failed to check if recipe ${this.recipe.id} is in favorites:`, error);
    }
  },
    methods: {
      async toggleLike() {
        try {
          const credentials = {
            recipeId: this.recipe.id
          };
          if(!this.isLiked)
            await markAsFavorite(credentials);
          else
            await unMarkAsFavorite(this.recipe.id);
          this.isLiked = !this.isLiked;
          this.$emit("likedChanged", this.recipe.id, this.isLiked); // Emit event to parent
          console.log("Event Triggered At RecipeLike");
        } catch (err) {
          this.isLiked = false;
          this.$root.toast("Error", err, "danger");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .custom-button {
    background-color: white;
    border-color: white;
    padding: 0;
    min-width: 18px;
    min-height: 15px;
    display: flex;
  }
  
  .custom-button .bi-heart,
  .custom-button .bi-heart-fill {
    color: #ff0000;
  }
  
  .btn.custom-button.btn-secondary:hover,
  .btn.custom-button.btn-secondary:focus,
  .btn.custom-button.btn-secondary:active {
    border: none;
    background: transparent;
    box-shadow: none;
    outline: none;
  }
  
  .hovered .bi-heart,
  .hovered .bi-heart-fill {
    background-color: rgb(241, 240, 240);
  }
  </style>
  