<template>
    <b-button @click="toggleLike" class="custom-button" :class="{ 'hovered': isHovered }">
      <i :class="isLiked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
    </b-button>
  </template>
  
  <script>
  import { mockAddFavorite } from "../services/user.js";
  import { BButton } from "bootstrap-vue";
  
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
    mounted() {
      this.isLiked = this.$root.store.isRecipeInFavorites(
        this.$root.store.username,
        this.recipe.id
      );
    },
    methods: {
      async toggleLike() {
        try {
          const response = mockAddFavorite(this.recipe.id);
          if (response.status === 200 && response.response.data.success) {
            this.isLiked = !this.isLiked;
            if (this.isLiked) {
              this.$root.store.addRecipeToFavorites(
                this.$root.store.username,
                this.recipe.id
              );
            } else {
              this.$root.store.deleteRecipeFromFavorites(
                this.$root.store.username,
                this.recipe.id
              );
            }
          } else {
            this.isLiked = false;
            this.$root.store.deleteRecipeFromFavorites(
              this.$root.store.username,
              this.recipe.id
            );
          }
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
  