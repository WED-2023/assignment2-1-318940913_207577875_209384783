<template>
  <div class="recipe-preview-container" @mouseover="isHovered = true" @mouseleave="isHovered = false">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <router-link v-if="meal" :to="{ name: 'RecipeMaking', params: { recipeId: recipe.id } }" class="recipe-preview">
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
    
    <div class="recipe-type-Like">
      <ul class="d-flex align-items-center list-unstyled mb-0">
        <li class="like-container" v-if="$root.store.username">
          <!-- <b-button @click="toggleLike" class="custom-button">
            <i :class="isLiked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
          </b-button> -->
          <RecipeLike :recipe="recipe" :is-hovered="isHovered"></RecipeLike>
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
import { mockAddFavorite } from "../services/user.js";
import { BButton } from 'bootstrap-vue';
import RecipeLike from "@/components/RecipeLike.vue";

export default {
  components: {
    BButton,
    RecipeLike
  },
  data() {
    return {
      image_load: true,
      isLiked: false ,
      hasViewedRecipe: false,
      isHovered: false
    };
  },
  props: {
    recipe: {
      type: Object,
      required: true
    },
    meal: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  mounted() 
  {
    this.isLiked = this.$root.store.isRecipeInFavorites(this.$root.store.username, this.recipe.id)
    this.checkIfViewed();
  },
  watch: {
    '$root.store.username': function(newVal, oldVal) {
    this.checkIfViewed();
    }
  },
  methods: {
    checkIfViewed() {
      if(this.$root.store.username)
      {
        const username = this.$root.store.username; 
        const seenByUser = this.$root.store.getUserseenBy(username);
        if(seenByUser.includes(this.recipe.id))
        {
          this.hasViewedRecipe=true;
        }
      }

    },
    removeRecipe() {
      this.$emit('remove', this.recipe);
    },
    async toggleLike() {
      try {
        const response = mockAddFavorite(this.recipe.id);
        if (response.status === 200 && response.response.data.success) {
          this.isLiked = !this.isLiked;
          if(this.isLiked)
          {
            this.$root.store.addRecipeToFavorites(this.$root.store.username, this.recipe.id);
          }
          else
          {
            this.$root.store.deleteRecipeFromFavorites(this.$root.store.username, this.recipe.id);
          }
        } else {
          this.isLiked = false; 
          this.$root.store.deleteRecipeFromFavorites(this.$root.store.username, this.recipe.id);
        }
      } catch (err) {
        this.isLiked = false; 
        this.$root.toast("Error", err, "danger");
      }
    },

  },
}
</script>

<style scoped>
.recipe-preview-container {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 350px;
  min-height: 350px;
  max-width: 150px;
  min-width: 340px;

}
.recipe-preview-container:hover
{
  background-color: rgba(241, 240, 240);
}

.recipe-preview {
  display: block;
  text-decoration: none;
  color: inherit;
  margin-bottom: 0;
}

.recipe-image-container {
  overflow: hidden; 
  height: 200px; 
}

.recipe-image {
  width: 100%;
  height: 100%; 
}

.recipe-footer {
  padding: 10px 0;
}

.recipe-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  justify-content: center; 
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
  margin-top: auto; 
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recipe-type-Like ul {
  display: flex;
  align-items: center;
  list-style-type: none;
  padding: 0;
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
.recipe-title.viewed {
  color: rgb(134, 129, 134);
}

</style>
