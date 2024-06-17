<template>
    <div>
        <RecipePreviewList title="My Meal" :recipes="mealRecipes" :meal='true'></RecipePreviewList>    
    </div>
</template>

<script>
    import RecipePreviewList from "@/components/RecipePreviewList.vue";
    import { mockGetRecipePreviewById } from "../services/recipes.js"; 
    import { mockGetRecipeFullDetails } from "../services/recipes.js"; 
    export default {
        data() {
            return {
            mealRecipes: [], 
            };
        },
        components: {
            RecipePreviewList,
        },
        mounted() {
            this.fetchMealRecipes();
        },
        methods: {
            fetchMealRecipes()
            {
                const username = this.$root.store.username; 
                const userMeals = this.$root.store.getUserMeals(username);
                for (const recipeID of userMeals)
                {
                    const response = mockGetRecipeFullDetails(recipeID);
                    this.mealRecipes.push(response.data.recipe);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>