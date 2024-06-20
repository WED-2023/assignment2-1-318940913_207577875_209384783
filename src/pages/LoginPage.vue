<template>
  <div class="login-container">
    <h1 class="title">Login</h1>
    <b-form @submit.prevent="onLogin">
      <!-- Username Input -->
      <b-form-group id="input-group-Username" label-cols-sm="3" label="Username:" label-for="Username">
          <b-input-group>
            <b-input-group-prepend is-text>
                <span class="input-group-text"><i class="fa fa-user" aria-hidden="true"></i></span>
            </b-input-group-prepend>
            <b-form-input id="Username" v-model="$v.form.username.$model" type="text" placeholder="Enter your username" :state="validateState('username')"></b-form-input>
          </b-input-group>
        <b-form-invalid-feedback v-if="$v.form.username.$error">Username is required.</b-form-invalid-feedback>
      </b-form-group>

      <!-- Password Input -->
      <b-form-group id="input-group-Password" label-cols-sm="3" label="Password:" label-for="Password" >
        <b-input-group>
          <b-input-group-prepend is-text>
            <span class="input-group-text"><i class="fa-solid fa-lock" aria-hidden="true"></i></span>
          </b-input-group-prepend>
          <b-form-input id="Password" type="password" v-model="$v.form.password.$model" placeholder="Enter your password" :state="validateState('password')"
          ></b-form-input>
        </b-input-group>
        <b-form-invalid-feedback v-if="$v.form.password.$error">Password is required.</b-form-invalid-feedback>
      </b-form-group>

      <!-- Submit Button -->
      <b-button type="submit" variant="primary" class="login-button">
        <i class="bi bi-box-arrow-in-right"></i> Login
      </b-button>
    </b-form>

    <!-- Register Link -->
    <div class="mt-2"> Don't have an account yet? <router-link to="login"> Register here.</router-link></div>

    <!-- Error and Success Alerts -->
    <b-alert v-if="form.submitError" variant="danger" dismissible show>
      Login failed: {{ form.submitError }}
    </b-alert>
    <b-alert v-if="form.submitSuccess" variant="success" dismissible show>
      Login succeeded!
    </b-alert>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { mockLogin } from "../services/auth.js";

export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
        submitError: undefined,
        submitSuccess: undefined,
      },
      success: true,
    };
  },
  validations: {
    form: {
      username: { required },
      password: { required },
    },
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async login() {
      try {
        const response = await mockLogin(this.form.username, this.form.password);
        if (response.status === 200 && response.response.data.success) {
          this.form.submitSuccess = true;
          this.$root.store.login(this.form.username);
          this.$router.push("/");
        } else {
          this.form.submitError = response.response.data.message;
        }
      } catch (err) {
        this.form.submitError = err.response.data.message;
      }
    },
    onLogin() {
      this.form.submitError = undefined;
      this.form.submitSuccess = undefined;
      this.$v.form.$touch();
      if (this.$v.form.$anyError) return;
      this.login();
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  max-width: 500px;
  min-height: 450px;
  margin: auto;
  padding: 40px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 50px;

}

.login-button {
  width: 100%;
  margin-top: 30px;
  font-size: 25px;
  background-color: green;
  border-color: green;
  border-radius: 8px;
}
.login-button:hover{
  background-color:rgb(2, 85, 2);
  border-color:rgb(2, 85, 2);
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 1.2rem;
}

h1.title{
  margin-bottom: 50px;
  font-weight: bold;
  font-size: 2.8rem;
  display: inline-block;
  border-bottom: 2px solid #42b983;
}
.input-group-text {
    display: flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
     font-weight: 400; 
     line-height: 3.5; 
    color: #495057;
    background-color: #e9ecef;
    border: none; 
    border-radius: 0.25rem;
}
.mt-2[data-v-16d8eba4] {
    font-size: 20px;}
.mt-2, .my-2 {
    margin-top: 1.5rem !important;
}
</style>
