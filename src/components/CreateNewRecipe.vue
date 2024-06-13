<template>
  <transition name="create-recipe">
    <div v-show="modalActive" class="modal" @click="close">
      <transition name="create-recipe-inner">
        <div v-show="modalActive" class="modal-inner">
          <button class="buttonExit" @click="close" type="button">
            <i class="far fa-times-circle"></i>
          </button>
          <h1>Come on, let's add a new recipe</h1>
          <div class="fields-group">
            <label for="recipeName">Recipe Name :  </label>
            <input type="text" placeholder="Recipe Name" v-model="recipeName">
            <label for="amountOfTime">Amount of Time (in minutes):</label>
            <input id="amountOfTime" type="number" placeholder="Amount of Time" v-model="amountOfTime">
            <label for="description">Description:</label>
            <textarea id="description" placeholder="Description" v-model="description" maxlength="100"></textarea>

            <label for="servings">Enough for (number of diners):</label>
            <input id="servings" type="number" placeholder="Number of diners" v-model="servings">
          </div>
          <div class="radio-group">
          <label>Recipe Type:</label>
          <label><input type="radio" value="vegan" v-model="recipeType"> Vegan</label>
          <label><input type="radio" value="vegetarian" v-model="recipeType"> Vegetarian</label>
          <label><input type="radio" value="regular" v-model="recipeType"> Regular</label>
          </div>
          <div class="checkbox-group">
            <label>Gluten Free:</label>
            <label><input type="radio" value="yes" v-model="isGlutenFree"> Yes</label>
            <!-- <label><input type="radio" value="no" v-model="isGlutenFree"> No</label> -->
          </div>
          <div class="ingredients-container">
            <label>Add ingredients </label>
            <div v-for="(ingredient, index) in ingredients" :key="index" class="ingredients-group">
            <input type="text" placeholder="Ingredient" v-model="ingredient.name">
            <input type="number" placeholder="Quantity" v-model="ingredient.quantity">
            <select v-model="ingredient.unit">
              <option value="Unit" disabled selected>Select Unit</option>
              <option value="KG">KG</option>
              <option value="L">L</option>
              <option value="ML">ML</option>
              <option value="Tbsp">Tbsp</option>

              
            </select>
          </div>
          <button @click="addIngredient" type="button">Add Ingredient</button>
          </div>
          <div class="fields-group">
            <label>Instructions:</label>
            <textarea id="Instructions" placeholder="Instructions" v-model="instructions"></textarea>
          </div>
          <div class="buttons-group">
            <button @click="resetFields" type="button" class="reset-button">Reset</button>
            <button @click="addRecipe" type="button">Create and Save</button>
          </div>

          
        </div>  
      </transition>
    </div>
  </transition> 
</template>

<script>
export default {
  props: ["modalActive"],
  setup(props, { emit }) {
    const close = () => {
      emit("close");
    };
    return { close };
  },
  data(){
    return {
      recipeName: '',
      amountOfTime: '',
      description: '',
      servings: '',
      recipeType: '',
      isGlutenFree: false,
      ingredients: [],
      instructions: '',
    };

  },
  methods:{
    addIngredient() {
      this.ingredients.push({ name: '', quantity: '', unit: '' });
    },
    resetFields() {
      this.recipeName = '';
      this.amountOfTime = '';
      this.description = '';
      this.servings = '';
      this.recipeType = '';
      this.isGlutenFree = false;
      this.ingredients = [];
      this.instructions = '';
  },
  addRecipe() {
      // Logic to save the recipe
    }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);

  .modal-inner {
    position: relative;
    max-width: 640px;
    width: 80%;
    max-height: 80vh; 
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
    color: black;
    border-radius: 8px;
    padding: 20px 20px;



    .buttonExit {
    position: absolute;
    top: 20px; 
    right: 20px; 
    padding: 3px 3px;
    border: none;
    font-size: 18px;
    color: rgb(246, 0, 0);
    cursor: pointer;
    background-color: transparent;
  }

    h1 {
      font-size: 24px;
      margin-bottom: 20px;
    }

    .fields-group {
      margin-bottom: 20px;

      label {
        margin-bottom: 15px;
        font-weight: bold;
      }

      input[type="text"],
      input[type="number"],
      textarea,
      select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 10px;
        font-size: 16px;
      }
    }

    .radio-group {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      align-items: center;

      label {
        font-size: 16px;
      }
    }

    .ingredients-container {
      max-height: 150px;
      overflow-y: auto;
      margin-bottom: 15px;

      .ingredients-group {
        display: flex;
        gap: 8px;
        margin-bottom: 10px;

        input[type="text"],
        input[type="number"] {
          width: 50%; // Adjust the width as needed
        }

        select {
          width: 30%; // Adjust the width as needed
        }
      }
    }

    .buttons-group {
      display: flex;
      justify-content: space-between;
      margin-top: 20px; // Add more space between buttons
    }

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      background-color: #42b983;
      color: white;
      transition: background-color 0.3s ease;
      flex: 1; // Make buttons fill available space evenly
      margin-left: 10px;
      margin-right: 10px;

      &:hover {
        background-color: #36a372;
      }
    }
      .reset-button {
      background-color: #f44336;

        &:hover {
          background-color: #d32f2f;
        }
    }

  }
}
</style>