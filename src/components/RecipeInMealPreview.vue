<template>
    <div>
        <RecipePreview :recipe="recipe" />
        <div class="mt-1">
            <b-progress :value="checkedCount" :max="recipe.instructions.length" variant="success" animated show-progress>
            <b-progress-bar :value="checkedCount">
                <strong>{{ checkedCount }} / {{ recipe.instructions.length }}</strong>
            </b-progress-bar>
            </b-progress>
        </div>
    </div>
</template>

<script>
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
            required: true
            }
        },
        data() {
            return {
            checkedInstructions: [],
            };
        },
        computed: {
            checkedCount() {
                return this.checkedInstructions.filter(Boolean).length;
            }
        },
        methods: {
            async fetchRecipeDetails() {
                try {
                    const response = await mockGetRecipeFullDetails(this.$route.params.recipeId);
                    console.log("response.status", response.status);
                    if (response.status !== 200) this.$router.replace("/NotFound");

                    const {
                        instructions,
                    } = response.data.recipe;

                    this.recipe = {
                        instructions,
                    };

                    this.originalServings = this.recipe.servings;

                    // Load saved progress or initialize if none
                    this.checkedInstructions = this.$root.store.getRecipeProgress(this.$route.params.recipeId) || instructions.map(() => false);

                } catch (error) {
                    console.log(error);
                    this.$router.replace("/NotFound");
                }
            },
        },
        async created() {
            await this.fetchRecipeDetails();
        }
    }
</script>

<style lang="scss" scoped>

</style>