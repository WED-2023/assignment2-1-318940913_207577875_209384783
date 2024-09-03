<template>
  <div>
    <RecipePreviewList
      title="My Recipes"
      :recipes="myRecipes"
      @addedNewRecipe="handleAddedNewRecipe"
    ></RecipePreviewList>
  </div>
</template>

<script>
import RecipePreviewList from "@/components/RecipePreviewList.vue";
import { getRecipeInMyRecipes } from "../services/user.js";

export default {
  data() {
    return {
      myRecipes: [],
    };
  },
  components: {
    RecipePreviewList,
  },
  mounted() {
    this.fetchFavoriteRecipes();
  },
  methods: {
    async fetchFavoriteRecipes() {
      try {
        this.myRecipes = await getRecipeInMyRecipes();
      } catch (error) {
        console.error("Error fetching my recipes:", error);
      }
    },
    async handleAddedNewRecipe() {
      await this.fetchFavoriteRecipes();
    },
  },
};
</script>

<style lang="scss" scoped></style>
