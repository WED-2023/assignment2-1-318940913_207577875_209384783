<template>
  <b-container>
    <h3 class="mb-4">{{ title }} :<slot></slot> </h3>
    <b-row>
      <b-col v-for="recipe in recipes" :key="recipe.id" cols="15" md="6" lg="8" class="mb-4">
        <!-- <RecipePreview class="recipePreview" :recipe="recipe"/> -->
        <RecipeInMealPreview v-if="meal" class="recipePreview" :recipe="recipe"/>
        <RecipePreview v-else class="recipePreview" :recipe="recipe"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";
import RecipeInMealPreview from "./RecipeInMealPreview.vue";


export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview,
    RecipeInMealPreview
  },
  props: {
    title: {
      type: String,
      required: true
    },
    recipes: {
      type: Array,
      required: true
    },
    meal: {
      type: Boolean,
      required: false,
      default: false
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}
</style>
