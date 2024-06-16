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
      <li v-if="recipe.vegetarian" class="mr-2" data-toggle="tooltip" title="Vegetarian"><i class="fas fa-seedling text-success"></i></li>
      <li v-if="recipe.vegan" class="mr-2" data-toggle="tooltip" title="Vegan"><i class="fas fa-leaf text-success"></i></li>
      <li v-if="recipe.glutenFree" class="mr-2" data-toggle="tooltip" title="Gluten Free"><i class="fas fa-bread-slice"></i></li>
      <li class="like-container" v-if="$root.store.username">
        <b-button variant="outline-danger" @click="toggleLike">
          <i v-if="!isLiked" class="bi bi-heart"></i>
          <i v-else class="bi bi-heart-fill"></i>
        </b-button>
      </li>
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
          this.$root.toast("Liked!", "This recipe is now in your favorites", "success");
        } else {
          this.isLiked = false; 
          this.$root.toast("Already Liked", "You've already liked this recipe", "info");
        }
      } catch (err) {
        this.isLiked = false; 
        this.$root.toast("Error", "Failed to like this recipe. Please try again later", "danger");
      }
    }
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
  justify-content: space-between;
  padding: 0;
  margin: 0 0 0 0;
  list-style: none;
}

.recipe-type-Like li {
  margin-right: 10px;
}

.like-container {
  margin-top: 5px;
  background-color: white ;
}

.like-container .btn-outline-danger {
  border-color: transparent; 
}

.card-body {
  margin: 0;
  padding: 0;
}
</style>
