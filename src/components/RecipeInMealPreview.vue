<template>
  <div>
    <RecipePreview :recipe="recipe" :meal="true"> </RecipePreview>
    <div class="recipe-preview mt-1">
      <b-progress
        :value="checkedCount"
        :max="recipe.instructions.length"
        variant="success"
        animated
        show-progress
      >
        <b-progress-bar :value="checkedCount">
          <strong>{{ checkedCount }} / {{ recipe.instructions.length }}</strong>
        </b-progress-bar>
      </b-progress>
    </div>
    <!-- <div class="mt-1">
            <b-button variant="danger" @click="removeRecipe">Remove from Meal</b-button>
        </div> -->
  </div>
</template>

<script>
import { getRecipeProgress } from "@/services/user.js";
import RecipePreview from "./RecipePreview.vue";
export default {
  name: "RecipeInMealPreview",
  extends: RecipePreview,
  components: {
    RecipePreview,
  },
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      checkedInstructions: [],
    };
  },
  computed: {
    checkedCount() {
      return this.checkedInstructions.filter(Boolean).length;
    },
  },
  async mounted() {
    this.checkedInstructions =
      (await getRecipeProgress(this.recipe.id)) ||
      this.recipe.instructions.map(() => false);
    if (this.checkedInstructions.length == 0)
      this.checkedInstructions = this.recipe.instructions.map(() => false);
  },
};
</script>

<style lang="scss" scoped>
.recipe-preview {
  max-height: 340px;
  max-width: 340px;
}
</style>
