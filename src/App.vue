<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" id="nav">
      <img src="/path/to/your/image.png" alt="Logo" class="navbar-logo" />   Rachel's recipes 
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="defaultNav">
          <b-nav-item :to="{ name: 'main' }">Main</b-nav-item> 
          <b-nav-item :to="{ name: 'search' }">Search</b-nav-item> 
          <b-nav-item :to="{ name: 'about' }">About</b-nav-item> 
          <b-nav-item v-if="$root.store.username" :to="{ name: 'create' }">Create</b-nav-item> 
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto User-section" v-if="!$root.store.username">
          <b-nav-item :to="{ name: 'login' }">Login</b-nav-item>
          <b-nav-item :to="{ name: 'register' }">Register</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto User-section" v-else>
          <b-nav-item-dropdown right>
            <template #button-content>
              Hello {{ $root.store.username }}
            </template>
            <b-dropdown-item :to="{ name: 'profile' }">Profile</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'settings' }">Settings</b-dropdown-item>
            <b-dropdown-item @click="Logout">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDropdown: false
    };
  },
  methods: {
    Logout() {
      this.$root.store.logout();
      this.$root.toast("Logout", "User logged out successfully", "success");
      this.$router.push("/").catch(() => {
        this.$forceUpdate();
      });
    }

  }
};
</script>

<style lang="scss">
@import "@/scss/form-style.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
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
  width: auto;
  margin-right: 8px;
  gap: 10px;
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
  margin-right: 50px;
}

#nav a {
  font-weight: bold;
  color: white;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
