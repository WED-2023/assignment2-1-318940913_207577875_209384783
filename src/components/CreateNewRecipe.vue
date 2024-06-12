<template>
  <transition name="create-recipe">
    <div v-show="modalActive" class="modal" @click="close">
      <transition name="create-recipe-inner">
        <div v-show="modalActive" class="modal-inner">
          <buttonExit @click="close" type="button">X</buttonExit>
          <h1>Come on, let's add a new recipe</h1>
          <div class="fields-group">
            <label for="recipeName">Recipe Name :  </label>
            <input type="text" placeholder="Recipe Name" v-model="recipeName">
            <label for="amountOfTime">Amount of Time (in minutes):</label>
            <input id="amountOfTime" type="number" placeholder="Amount of Time" v-model="amountOfTime">
            <label for="description">Description:</label>
            <textarea id="description" placeholder="Description" v-model="description"></textarea>
            <label for="servings">Enough for (number of diners):</label>
            <input id="servings" type="number" placeholder="Number of diners" v-model="servings">
          </div>
          <div class="radio-group">
          <label>Recipe Type:</label>
          <label><input type="radio" value="vegan" v-model="recipeType"> Vegan</label>
          <label><input type="radio" value="vegetarian" v-model="recipeType"> Vegetarian</label>
          <label><input type="radio" value="regular" v-model="recipeType"> Regular</label>
          </div>
          <div class="radio-group">
            <label>Gluten Free:</label>
            <label><input type="radio" value="yes" v-model="isGlutenFree"> Yes</label>
            <label><input type="radio" value="no" v-model="isGlutenFree"> No</label>
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
            </select>
          </div>
          <button @click="addIngredient" type="button">Add Ingredient</button>
          </div>
          <div class="fields-group">
            <label>Instructions:</label>
            <textarea id="Instructions" placeholder="Instructions" v-model="description"></textarea>
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
      ingredients: []
    };

  },
  methods:{
    addIngredient() {
      this.ingredients.push({ name: '', quantity: '', unit: '' });
    }
  }
};
</script>

<style lang="scss" scoped>
.create-recipe-enter-active,
.create-recipe-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.create-recipe-enter-from,
.create-recipe-leave-to {
  opacity: 0;
}

.create-recipe-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.create-recipe-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.create-recipe-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.create-recipe-inner-leave-to {
  transform: scale(0.8);
}

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
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background-color: white;
    padding: 10px 16px;
    color: black;

    buttonExit {
      padding: 3px 3px;
      border: none;
      font-size: 18px;
      color: rgb(246, 0, 0);
      cursor: pointer;
      background-color: white;
      margin-left: 600px;
    }
  }
}

.fields-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.form-group label {
  margin-bottom: 8px;
  font-weight: bold;
}
.radio-group {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
}
.ingredients-group {
  margin-bottom: 16px;

}
.ingredients-container {
  max-height: 150px; /* Adjust as needed */
  overflow-y: auto;
  margin-bottom: 15px;
}

.ingredient-item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
textarea {
  min-height: 100px;
}
ֿbutton {
  padding: 8px 12px;
  border: none;
  font-size: 16px;
  background-color: #42b983;
  color: white;
  cursor: pointer;
  margin-top: 16px;
}

button:hover {
  background-color: #36a372;
}
</style>