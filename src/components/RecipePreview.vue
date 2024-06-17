<template>
  <div class="recipe-preview-container">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <router-link :to="{ name: 'recipe', params: { recipeId: recipe.id } }" class="recipe-preview">
      <div class="recipe-image-container">
        <b-card v-if="image_load" :img-src="recipe.image" img-alt="Recipe Image" tag="article" class="recipe-image"></b-card>
      </div>
      <div class="recipe-footer">
        <div class="recipe-title">{{ recipe.title }}</div>
        <ul class="recipe-overview">
          <li><i class="fas fa-clock"></i> {{ recipe.readyInMinutes }} minutes</li>
          <li><i class="bi bi-heart-fill"></i>{{ recipe.aggregateLikes }} likes</li>
        </ul>
      </div>
    </router-link>
    <ul class="recipe-type-Like d-flex align-items-center list-unstyled mb-0">
      <li class="like-container" v-if="$root.store.username">
        <b-button @click="toggleLike" class="custom-button">
          <!-- <i v-if="!isLiked" class="bi bi-heart"></i>
          <i v-else class="bi bi-heart-fill"></i> -->
          <i :class="isLiked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
        </b-button>
      </li>
      <li v-if="recipe.vegetarian"  data-toggle="tooltip" title="Vegetarian"><i class="fas fa-seedling text-success"></i></li>
      <li v-if="recipe.vegan" data-toggle="tooltip" title="Vegan"><i class="fas fa-leaf text-success"></i></li>
      <li v-if="recipe.glutenFree" data-toggle="tooltip" title="Gluten Free"><i class="fas fa-bread-slice"></i></li>

    </ul>
  </div>
</template>

<script>
import { mockAddFavorite } from "../services/user.js";
import { BButton } from 'bootstrap-vue';

export default {
  components: {
    BButton
  },
  data() {
    return {
      image_load: true,
      isLiked: false 
    };
  },
  props: {
    recipe: {
      type: Object,
      required: true
    },
  },
  methods: {
    async toggleLike() {
      try {
        const response = await mockAddFavorite(this.recipe.id);
        if (response.status === 200 && response.response.data.success) {
          this.isLiked = true; 
        } 
        else {
          this.isLiked = false; 
        }
      } catch (err) {
        this.isLiked = false; 
        this.$root.toast("Error", err, "danger");
        
      }
    },

  },
  mounted() {
  this.isLiked = this.$root.store.getRecipeLike(this.recipe.id);
}
};
</script>

<style scoped>
.recipe-preview-container {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.recipe-preview {
  display: block;
  text-decoration: none;
  color: inherit;
  margin-bottom: 0;
}

.recipe-image-container {
  overflow: hidden; 
}

.recipe-image {
  width: 100%;
  height: 100%; 
  border: #ddd;
}

.recipe-footer {
  padding: 10px 0;
}

.recipe-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-left: 10%;
}

.recipe-overview {
  display: flex;
  gap: 15px;
  margin: 0 50px 0 50px;
}

.recipe-overview li {
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 4px;
}

.recipe-type-Like {
  display: flex;
  align-items: center;
  margin-left: 65px;
}

.recipe-type-Like li {
  margin-left: 15px;
}

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
.card-body {
  margin: 0;
  padding: 0;
}

</style>
