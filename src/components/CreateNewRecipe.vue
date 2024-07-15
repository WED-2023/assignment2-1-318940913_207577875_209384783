<template>
  <b-modal v-model="modalActive" @hide="close" size="lg" hide-footer title="Come on, let's add a new recipe">
    <div class="modal-inner">
      <div class="modal-body">
        <!-- Left Column: Recipe Details -->
        <div class="left-column">
          <h1>Recipe Details</h1>
          <input type="text" placeholder="Recipe Name" required v-model="title" :class="{ 'input-error': isFormSubmitted && !title }" class="input-style">
          <div class="time-servings-container">
            <div class="field-readyInMinutes">
              <select v-model.number="readyInMinutes" required class="styled-select" :class="{ 'input-error': isFormSubmitted && !readyInMinutes }">
                <option  disabled value="" class="placeholder">Cooking Time </option>
                <option v-for="time in cookingTimes" :key="time" :value="time">{{ time }} minutes</option>
              </select>
            </div>
            <div class="field-servings">
              <select v-model.number="servings" required class="styled-select" :class="{ 'input-error': isFormSubmitted && !servings }">
                <option disabled value="">Number of diners</option>
                <option v-for="serving in servingsOptions" :key="serving" :value="serving">{{ serving }} diners</option>
              </select>
            </div>
          </div>

          <textarea id="summary" class="summary-textarea" placeholder="Description" v-model="summary"  maxlength="100" required :class="{ 'input-error': isFormSubmitted && !summary }"></textarea>
          <div class="form-check">
            <b-form-checkbox v-model="vegan" id="inlineCheckbox1" name="inline-checkbox" switch style="margin-bottom: 10px;"> Vegan </b-form-checkbox>
          </div>
          <div class="form-check">
            <b-form-checkbox v-model="vegetarian" id="inlineCheckbox2" name="inline-checkbox" switch style="margin-bottom: 10px;"> Vegetarian </b-form-checkbox>
          </div>
          <div class="form-check">
            <b-form-checkbox v-model="isGlutenFree" id="inlineCheckbox3" name="inline-checkbox" switch style="margin-bottom: 15px;">Gluten Free </b-form-checkbox>
          </div>
          <div class="image-form">
        <b-form-file id="file-default" placeholder="Choose an image or drop it here.." drop-placeholder="Drop image here..." v-model="image" size="sm" required :class="{ 'input-error': isFormSubmitted && !image }" accept="image/*" @change="handleFileUpload" ></b-form-file>
        <div class="image-preview" v-if="image">
              <img :src="imageUrl" alt="Selected Image" class="img-fluid" />
          </div>    
      </div >
          
          
        </div>
        <!-- --------------------------------------------------------------------------------------------------------------------------------------- -->
        <!-- Right Column: Ingredients and Instructions -->
        <div class="right-column">
          <h1>Ingredients:</h1>
          <div class="ingredients-container">
            <div v-for="(ingredient, index) in ingredients" :key="index" class="ingredients-group">
              <input type="text" :placeholder="'Ingredient...'" v-model="ingredient.name" required 
                :class="{ 'input-error': isFormSubmitted && !ingredient.name }" >
              <input type="number" :placeholder="'Quantity...'" step="0.5" min="0.5" v-model="ingredient.quantity" required 
                :class="{ 'input-error': isFormSubmitted && !ingredient.quantity }" >
              <select v-model="ingredient.unit" class="select-unit" required 
                :class="{ 'input-error': isFormSubmitted && !ingredient.unit }">
                <option value="" disabled selected>Unit</option>
                <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
              </select>
              <b-icon variant="danger" icon="dash" @click="removeIngredient(index)" :class="{ 'disabled-icon': ingredients.length == 1 }" style="margin-top: 5px;"></b-icon>
            </div>
          </div>
          <b-icon variant="success" icon="plus" @click="addIngredient"></b-icon>
          <h1>Instructions</h1>
          <div class="instructions-container">
            <div v-for="(instruction, index) in instructions" :key="index" class="instructions-group">
              <input type="text" :placeholder="'Enter instruction...'" v-model="instruction.name" required  :class="{ 'input-error': isFormSubmitted && !instruction.name }">
              <b-icon variant="danger" icon="dash" @click="removeInstruction(index)"  :class="{ 'disabled-icon': instructions.length === 1 }"></b-icon>
            </div>
          </div>
          <b-icon variant="success" icon="plus" @click="addInstruction"></b-icon>
        </div>
        <!-- --------------------------------------------------------------------------------------------------------------------------------------- -->
      </div>
    </div>

    <div class="buttons-group">
      <button @click="resetFields" type="button" class="reset-button">Clear</button>
      <button @click="submitForm" >Create</button>
    </div>
  </b-modal>
</template>

<script>
import { BFormFile, BFormCheckbox, BModal ,BToast} from 'bootstrap-vue';
// import { BFormSpinbutton } from 'bootstrap-vue';
import { createNewRecipe } from "../services/user.js";

export default {
  components: {
    BFormFile,
    BFormCheckbox,
    BModal,
    // BFormSpinbutton,
    BToast
  },
  props: {
    modalActive: Boolean,
  },
  data() {
    return {
      title: '',
      image: null,
      readyInMinutes: '',
      summary: '',
      servings: '',
      vegan: false,
      vegetarian: false,
      isGlutenFree: false,
      ingredients: [{ name: '', quantity: '', unit: '' }],
      instructions: [{ name: '' }],
      cookingTimes: [
        5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
        55, 60, 75, 90, 105, 120, 135, 150,
        165, 180, 210, 240, 270, 300, 330, 360
      ],
      servingsOptions: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15
      ],
      units: [
        'Gram', 'Kilogram', 'Milliliter',
        'Liter', 'Curt', 'Teaspoon', 'Spoon', 'Cup'
      ],
      isFormSubmitted: false,
    };
  },
  computed:{
    canAddIngredient() {
      const lastIngredient = this.ingredients[this.ingredients.length - 1];
      return lastIngredient.name && lastIngredient.quantity && lastIngredient.unit;
    },
    canAddInstruction() {
      const lastInstruction = this.instructions[this.instructions.length - 1];
      return !!(lastInstruction && lastInstruction.name.trim());
    },
    imageUrl() {
      // Compute the URL for displaying the image preview
      return this.image ? URL.createObjectURL(this.image) : '';
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    addIngredient() {
      if (this.canAddIngredient) {
        this.ingredients.push({ name: '', quantity: '', unit: '' });
        // this.$root.$bvToast.toast("A new ingredient has been included in your recipe",{title:"Ingredient added!" ,variant: 'success',toaster: 'b-toaster-top-right',solid: true,autoHideDelay: 2000, appendToast: true,});
      } else {
        this.$root.$bvToast.toast("Please fill in all fields for the current ingredient before adding a new one.",{title:"Cannot add ingredient!" ,variant: 'danger',toaster: 'b-toaster-top-right',solid: true,autoHideDelay: 2000, appendToast: true,});
      }
    },
    removeIngredient(index) {
      if (this.ingredients.length > 1) {
        this.ingredients.splice(index, 1);
        // this.$root.$bvToast.toast("Ingredient removed!",{title: 'The selected ingredient has been deleted from your recipe',variant: 'warning',toaster: 'b-toaster-top-right',solid: true,
        // autoHideDelay: 2000, appendToast: true,});
      }
    },
    addInstruction() {
      if (this.canAddInstruction) {
        this.instructions.push({ name: '' });
        // this.$root.$bvToast.toast("A new instruction has been added to your recipe",{title:"Instruction added!" ,variant: 'success',toaster: 'b-toaster-top-right',solid: true,autoHideDelay: 2000, appendToast: true,});
      } else {
        this.$root.$bvToast.toast("Please fill in the instruction field before adding a new one.",{title:"Cannot add instruction!",variant: 'danger',toaster: 'b-toaster-top-right',solid: true,autoHideDelay: 2000, appendToast: true,});
      }
    },
    removeInstruction(index) {
      if (this.instructions.length > 1) {
        this.instructions.splice(index, 1);
        // this.$root.$bvToast.toast("The selected instruction has been deleted from your recipe",{title:"Instruction removed!",variant: 'warning',toaster: 'b-toaster-top-right',solid: true,autoHideDelay: 2000, appendToast: true,});

      }
    },
    resetFields() {
      this.title = '';
      this.readyInMinutes = '';
      this.summary = '';
      this.servings = '';
      this.vegan = false;
      this.vegetarian = false;
      this.isGlutenFree = false;
      this.ingredients = [{ name: '', quantity: '', unit: '' }];
      this.instructions = [{ name: '' }];
      this.image = null;
      this.isFormSubmitted = false; 
    },
    async submitForm() {
      this.isFormSubmitted = true; 
      if (this.isFormValid()) {
        const recipeContent = {
          title: this.title,
          image: this.image,
          ready_in_minutes: this.readyInMinutes,
          summary: this.summary,
          servings: this.servings,
          vegan: this.vegan,
          vegetarian: this.vegetarian,
          is_gluten_free: this.isGlutenFree,
          ingredients: this.ingredients,
          instructions: this.instructions
        };
        console.log("Client - recipeContent.instructions = ", recipeContent.instructions);
        const response = await createNewRecipe(recipeContent);
        if (response.status === 201 && response.data.success) {
          this.$root.$bvToast.toast("Recipe added successfully.",{title:"Success!",variant: 'success',toaster: 'b-toaster-top-right',solid: true,autoHideDelay: 2000, appendToast: true,});
          this.modalActive = false;
          this.resetFields();
        } else {
          this.$root.$bvToast.toast("Failed to add the recipe. Please try again.",{title:"Failed!",variant: 'danger',toaster: 'b-toaster-top-right',solid: true,autoHideDelay: 2000, appendToast: true,});

        }
      } else {
        this.$root.$bvToast.toast('Please fill in all the required fields.',{title:"Fields are missing!",variant: 'danger',toaster: 'b-toaster-top-right',solid: true,autoHideDelay: 2000, appendToast: true,});

      }
    },
    isFormValid() {
      return (
        this.title &&
        this.image &&
        this.readyInMinutes &&
        this.summary &&
        this.servings &&
        this.ingredients.every(ingredient => ingredient.name && ingredient.quantity && ingredient.unit) &&
        this.instructions.every(instruction => instruction.name)
      );
    },
    handleFileUpload(event) {
      this.image = event.target.files[0];
    }
  },
};
</script>

<style lang="scss" scoped>
.input-style {
  width: 325px;
  height: 30px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 15px;
}

h1 {
  font-size: 18px;
  color: #333;
  margin-bottom: 5px;
  border-bottom: 2px solid #42b983;

  padding-bottom: 10px;
}

.modal-body {
  width: 100%;
  display: flex;
  gap: 15px;
  padding: 0.1rem;
  height: 500px;
}

.left-column {
  width: 55%;
}

.right-column {
  width: 65%;
}
.disabled-button {
  cursor: not-allowed;
  opacity: 0.6;
}
.summary-textarea{
  width: 325px;
  height: 90px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 15px;
}

.time-servings-container {
  display: flex;
  gap: 4px;
}

.styled-select {
  width: 160px;
  height: 30px;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 15px;
  color: gray;
}

.styled-select option:checked {
  color: black;
  background-color: #f0f0f0;
}


.input-field {
  width: 100%;
  height: 30px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 15px;
}

.select-unit {
  width: 80px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 15px;
  color: #898989;
}

.ingredients-container {
  max-height: 200px;
  overflow-y: auto;
  

  .ingredients-group {
    display: flex;
    gap: 6px;
    input[type="text"].input-error,
    input[type="number"].input-error,
    select.input-error {
      border-color: red; 
    }
    input[type="text"] {
      width: 175px; 
      height: 30px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 15px;
      margin-bottom: 4px;

    }
    input[type="number"] {
      width: 100px; 
      height: 30px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 15px;
      margin-bottom: 4px;
    }
    select {
      width: 95px; 
      height: 30px;
      padding: 1px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 15px;
      margin-bottom: 4px;
    }
  }
}

.instructions-container {
  max-height: 200px;
  overflow-y: auto;

  .instructions-group {
    display: flex;
    align-items: center;
    input[type="text"].input-error,
    input[type="number"].input-error,
    select.input-error {
      border-color: red; 
    }

    input[type="text"] {
      width: 390px; 
      height: 30px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 15px;
      margin-bottom: 4px;
    }
  }
}

.buttons-group {
  margin-top: 10px;
  margin-left: 75%;
  
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    background-color: #42b983;
    color: white;
    transition: background-color 0.3s ease;
    flex: 1;
    margin-right: 10px;
    &:hover {
      background-color: #36a372;
    }
  }

  .reset-button {
    background-color: grey;
    &:hover {
      background-color: #4f4c4c;
    }
  }
}
.image-form{
  width: 100%;
}
.image-form .input-error{
  height: 32.5px;
  border: 1px solid red;
  border-radius: 5px;

}
.input-error {
  border-color: red ;
}
.image-preview img {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 160px;
  width: 100%;
}
</style>