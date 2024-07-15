<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" id="nav" fixed="top">
      <img src="@/assets/Rachel.png" alt="Logo" class="navbar-logo" @click="moveToMain" />
      <span class="brand-text">Rachel's Recipes</span>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="defaultNav">
          <b-nav-item :to="{ name: 'main' }">Main</b-nav-item> 
          <b-nav-item :to="{ name: 'search' }">Search</b-nav-item> 
          <b-nav-item :to="{ name: 'about' }">About</b-nav-item> 
          <b-nav-item v-if="$root.store.username" @click="toggleModal">Add Recipe
            <CreateNewRecipe @close="toggleModal" :modalActive="modalActive"></CreateNewRecipe>
        </b-nav-item>
        <b-navbar-nav>
          <!-- <b-form-input v-model="searchText" placeholder="Search..." />
          <b-nav-item :to="{ name: 'search' }" size="sm">Search</b-nav-item> -->
          <b-form-input v-model="searchText" placeholder="Search..." @keyup.enter="handleSearch" />
          <b-nav-item :to="{ name: 'search' }" size="sm" @click="handleSearch">Search</b-nav-item>
        </b-navbar-nav>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto User-section" v-if="!$root.store.username">
          <b-nav-item :to="{ name: 'login' }">Login</b-nav-item>
          <b-nav-item :to="{ name: 'register' }">Register</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto User-section" v-else>
          <b-nav-item :to="{ name: 'MealMaking' }">
            <!-- <img :src="require('@/assets/foodIcon.png')" alt="Logo" class="meals-logo" /> -->
             My Meal ({{ this.$root.store.getUserMeals(this.$root.store.username).length }})
          </b-nav-item>
          <b-nav-item-dropdown right>
            <template #button-content>
              Hello {{ $root.store.username }}
            </template>
            <b-dropdown-item :to="{ name: 'FavoriteRecipes' }">Favorite Recipes</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'MyRecipes' }">My Recipes </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'FamilyRecipes' }">Family Recipes</b-dropdown-item>
            <b-dropdown-item @click="Logout">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
import CreateNewRecipe from '@/components/CreateNewRecipe.vue';
import {logOutServer} from "@/services/auth";

import { ref } from "vue";
export default {
  data() {
    return {
      showDropdown: false,
      searchText:''
    };
  },
  components:{
    CreateNewRecipe,
  },
  setup() {
    const modalActive = ref(false);
    const toggleModal = () => {
      modalActive.value = !modalActive.value;
    };

    return { modalActive, toggleModal };
  },
  methods: {
    async Logout() {
      try{
          const response = await logOutServer();
          this.$root.store.logout();
          this.$root.toast("Logout", "User logged out successfully", "success");
          this.$router.push("/").catch(() => {
            this.$forceUpdate();
          });
        }
      catch (error) {
        this.$root.toast("Logout Error", "Failed to log out. Please try again.", "danger");
      }
    },
    handleSearch() {
      this.$router.push({ name: 'search', query: { q: this.searchText } });
    },
    moveToMain() {
      if (this.$route.name !== 'main') {
      this.$router.push({ name: 'main' });
    }
    }
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Karla:wght@300;400&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Karla", sans-serif;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  padding-top: 60px; 
  margin-top: 10px;
    .dropdown-item, .nav-item {
      // color: white;
      background-color: #2f2626;; 
      border-color: #2f2626;
    }
    .dropdown-item:hover, .nav-item:hover {
      color: #42b983; 
    }
}

#nav {
  height: 50px; 
  padding: 20px;
  display: flex;
  align-items: center;
  background-color: #2f2626;
  color: white;
}

.navbar-logo {
  width: 60px; 
  height: 100; 
  object-fit: cover; 
  margin-right: 25px;
  gap: 10px;
  margin-left: 15px;
  border-radius: 8px;
}

.navbar-logo:hover {
  cursor: pointer;
}

.brand-text {
  font-weight: bold;
}

.defaultNav {
  display: flex;
  gap: 25px;
  margin: auto;
}

.User-section {
  align-items: center;
  position: relative;
  gap: 25px;
  margin-right: 15px;
}

#nav a {
  font-weight: bold;
  color: white;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.meals-logo {
  width: 40px; 
  height: 25px; 
  object-fit: cover; 
  margin-right: 5px;
  gap: 10px;
  margin-left: 15px;
  border-radius: 8px;
}
</style>
