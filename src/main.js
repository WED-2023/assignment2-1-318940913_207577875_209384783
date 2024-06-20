import Vue from "vue";
import App from "./App.vue";
import VueAxios from "vue-axios";
import axios from "axios";
import { BootstrapVue, IconsPlugin, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(BootstrapVueIcons)


import routes from "./routes";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const router = new VueRouter({ 
  routes,
});

import Vuelidate from "vuelidate";


import {
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
} from "bootstrap-vue";
[
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
].forEach((x) => Vue.use(x));
Vue.use(Vuelidate);

axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

const shared_data = {
  server_domain: "http://localhost:3000",
  username: localStorage.username,
  login(username) {
    localStorage.setItem("username", username);
    this.username = username;
    console.log("login", this.username);
  },
  logout() {
    console.log("logout");
    localStorage.removeItem("username");
    this.username = undefined;
  },
  // ------------------------------------------------------------------------------------
  saveRecipeProgress(recipeId, progress) {
    if (!this.username) {
      console.warn("No user logged in. Progress will not be saved.");
      return;
    }
    const userProgress = JSON.parse(localStorage.getItem("userProgress")) || {};
    userProgress[this.username] = userProgress[this.username] || {};
    userProgress[this.username][recipeId] = progress;
    localStorage.setItem("userProgress", JSON.stringify(userProgress));
  },
  getRecipeProgress(recipeId) {
    const userProgress = JSON.parse(localStorage.getItem("userProgress")) || {};
    return (userProgress[this.username] && userProgress[this.username][recipeId]) || [];
  },
  addRecipeToMeal(username, recipeId) {
    if (!this.username) {
      console.warn("No user logged in. Recipe will not be added to the meal.");
      return;
    }
    const userMeals = JSON.parse(localStorage.getItem("userMeals")) || {};
    userMeals[username] = userMeals[username] || [];
    if (!userMeals[username].includes(recipeId)) {
      userMeals[username].push(recipeId);
    }
    localStorage.setItem("userMeals", JSON.stringify(userMeals));
  },
  saveRecipesToMeal(username, recipeIds) {
    if (!this.username) {
      console.warn("No user logged in. Recipes will not be added to the meal.");
      return;
    }
    const userMeals = JSON.parse(localStorage.getItem("userMeals")) || {};
    userMeals[username] = recipeIds;
    localStorage.setItem("userMeals", JSON.stringify(userMeals));
  },
  getUserMeals(username) {
    const userMeals = JSON.parse(localStorage.getItem("userMeals")) || {};
    return userMeals[username] || [];
  },
  // ------------------------------------------------------------------------------------
  addRecipeToFavorites(username, recipeId) {
    if (!this.username) {
      console.warn("No user logged in. Recipe will not be added to the meal.");
      return;
    }
    const userFavorites = JSON.parse(localStorage.getItem("userFavorites")) || {};
    userFavorites[username] = userFavorites[username] || [];
    if (!userFavorites[username].includes(recipeId)) {
      userFavorites[username].push(recipeId);
    }
    localStorage.setItem("userFavorites", JSON.stringify(userFavorites));
  },
  deleteRecipeFromFavorites(username, recipeId) {
    const userFavorites = JSON.parse(localStorage.getItem("userFavorites")) || {};
    if (!userFavorites[username]) {
      console.warn("No favorites found for the user.");
      return;
    }
  
    // Filter out the recipeId from the user's favorites
    userFavorites[username] = userFavorites[username].filter(id => id !== recipeId);
  
    localStorage.setItem("userFavorites", JSON.stringify(userFavorites));
  },
  saveRecipesToFavorites(username, recipeIds) {
    if (!this.username) {
      console.warn("No user logged in. Recipes will not be added to the meal.");
      return;
    }
    const userFavorites = JSON.parse(localStorage.getItem("userFavorites")) || {};
    userFavorites[username] = recipeIds;
    localStorage.setItem("userFavorites", JSON.stringify(userFavorites));
  },
  getUserFavorites(username) {
    const userFavorites = JSON.parse(localStorage.getItem("userFavorites")) || {};
    return userFavorites[username] || [];
  },
  isRecipeInFavorites(username, recipeId) {
    const userFavorites = JSON.parse(localStorage.getItem("userFavorites")) || {};
    if (!userFavorites[username]) {
      return false; // No favorites found for the user
    }

    return userFavorites[username].includes(recipeId);
  },
  // ------------------------------------------------------------------------------------
  addRecipeToMyRecipes(username, recipeId) {
    if (!this.username) {
      console.warn("No user logged in. Recipe will not be added to the meal.");
      return;
    }
    const userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || {};
    userRecipes[username] = userRecipes[username] || [];
    if (!userRecipes[username].includes(recipeId)) {
      userRecipes[username].push(recipeId);
    }
    localStorage.setItem("userRecipes", JSON.stringify(userRecipes));
  },
  deleteRecipeFromMyRecipes(username, recipeId) {
    const userRecipes = JSON.parse(localStorage.getItem("userFavuserRecipesorites")) || {};
    if (!userRecipes[username]) {
      console.warn("No favorites found for the user.");
      return;
    }
    userRecipes[username] = userRecipes[username].filter(id => id !== recipeId);
    localStorage.setItem("userRecipes", JSON.stringify(userRecipes));
  },
  getUserMyRecipes(username) {
    const userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || {};
    return userRecipes[username] || [];
  },
  isRecipeInMyRecipes(username, recipeId) {
    const userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || {};
    if (!userRecipes[username]) {
      return false; 
    }
    return userRecipes[username].includes(recipeId);
  },
  // TODO: Change it to get the last ID in the DB
  getUserLastRecipeID(username) {
    const userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || {};
    if(userRecipes[username])
    {
      return userRecipes[username][userRecipes[username].length - 1].id + 1
    }
    return 1;
  },
  // ------------------------------------------------------------------------------------
};
console.log(shared_data);
// Vue.prototype.$root.store = shared_data;

new Vue({
  router,
  data() {
    return {
      store: shared_data,
    };
  },
  methods: {
    toast(title, content, variant = null, append = false) {
      this.$bvToast.toast(`${content}`, {
        title: `${title}`,
        toaster: "b-toaster-top-center",
        variant: variant,
        solid: true,
        appendToast: append,
        autoHideDelay: 3000,
      });
    },
  },
  render: (h) => h(App),
}).$mount("#app");