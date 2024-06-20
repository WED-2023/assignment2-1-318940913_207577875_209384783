<template>
  <div class="container">
    <h1 class="title">Register</h1>
    <b-form @submit.prevent="onRegister" @reset.prevent="onReset">
      <b-form-group id="input-group-username" label-cols-sm="3" label="Username:" label-for="username" >
        <b-input-group>
          <b-input-group-prepend is-text>
            <span class="input-group-text"><i class="fa fa-user" aria-hidden="true"></i></span>
          </b-input-group-prepend>
          <b-form-input id="username" v-model="$v.form.username.$model" type="text" :state="validateState('username')" ></b-form-input>
        </b-input-group>
        <b-form-invalid-feedback v-if="!$v.form.username.required"> Username is required</b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.form.username.length"> Username length should be between 3-8 characters long </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.form.username.alpha"> Username must only contain alphabetic characters </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="input-group-country"  label-cols-sm="3" label="Country:"  label-for="country"  >
        <b-input-group>
          <b-input-group-prepend is-text>
            <span class="input-group-text"><i class="fa fa-flag" aria-hidden="true"></i></span>
          </b-input-group-prepend>
        <b-form-select  id="country" v-model="$v.form.country.$model"  :options="countries"  :state="validateState('country')"
        ></b-form-select>
      </b-input-group>
        <b-form-invalid-feedback> Country is required </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="input-group-Password" label-cols-sm="3" label="Password:" label-for="password" >
        <b-input-group>
          <b-input-group-prepend is-text>
            <span class="input-group-text"><i class="fa-solid fa-lock" aria-hidden="true"></i></span>
          </b-input-group-prepend>
        <b-form-input id="password" type="password" v-model="$v.form.password.$model" :state="validateState('password')"
        ></b-form-input>
      </b-input-group>

        <b-form-invalid-feedback v-if="!$v.form.password.required"> Password is required </b-form-invalid-feedback>
        <b-form-text v-else-if="$v.form.password.$error" text-variant="info">  Your password should be <strong>strong</strong>. <br /> </b-form-text> <b-form-invalid-feedback
          v-if="$v.form.password.required && !$v.form.password.length"> Password must have length between 5-10 characters long
      </b-form-invalid-feedback>
      <b-form-invalid-feedback v-if="$v.form.password.required && !$v.form.password.containsNumber"> Password must contain at least one number </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="$v.form.password.required && !$v.form.password.containsSpecialChar"> Password must contain at least one special character </b-form-invalid-feedback>

      </b-form-group>

      <b-form-group id="input-group-confirmedPassword" label-cols-sm="3" label="Confirm Password:" label-for="confirmedPassword" >
        <b-input-group>
          <b-input-group-prepend is-text>
            <span class="input-group-text"><i class="fa-solid fa-lock" aria-hidden="true"></i></span>
          </b-input-group-prepend>
        <b-form-input  id="confirmedPassword" type="password" v-model="$v.form.confirmedPassword.$model" :state="validateState('confirmedPassword')" ></b-form-input>
      </b-input-group>
        <b-form-invalid-feedback v-if="!$v.form.confirmedPassword.required"> Password confirmation is required </b-form-invalid-feedback>
        <b-form-invalid-feedback  v-else-if="!$v.form.confirmedPassword.sameAsPassword" > The confirmed password is not equal to the original password </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="reset" variant="danger">Reset</b-button>
      <b-button type="submit" variant="primary" >Register</b-button >
      <div class="mt-2"> You have an account already? <router-link to="login"> Log in here</router-link></div>
    </b-form>
    <b-alert class="mt-2"  v-if="form.submitError" variant="warning" dismissible show > Register failed: {{ form.submitError }} </b-alert>

  </div>
</template>

<script>
import countries from "../assets/countries";
import {
  required,
  minLength,
  maxLength,
  alpha,
  sameAs,
  email
} from "vuelidate/lib/validators";
import { mockRegister } from "../services/auth.js";



export default {
  name: "Register",
  data() {
    return {
      form: {
        username: "",
        firstName: "",
        lastName: "",
        country: null,
        password: "",
        confirmedPassword: "",
        email: "",
        submitError: undefined
      },
      countries: [{ value: null, text: "", disabled: true }],
      errors: [],
      validated: false
    };
  },
  validations: {
    form: {
      username: {
        required,
        length: (u) => minLength(3)(u) && maxLength(8)(u),
        alpha
      },
      country: {
        required
      },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10),
        containsNumber: value => /\d/.test(value),
        containsSpecialChar: value => /[!@#$%^&*(),.?":{}|<>]/.test(value)
      },
      confirmedPassword: {
        required,
        sameAsPassword: sameAs("password")
      }
    }
  },
  mounted() {
    // console.log("mounted");
    this.countries.push(...countries);
    // console.log($v);
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async Register() {
      try {
        const userDetails = {
          username: this.form.username,
          password: this.form.password
        };
        const response = mockRegister(userDetails);
        this.$router.push("/login");
      } catch (err) {
        console.log(err.response);
        this.form.submitError = err.response.data.message;
      }
    },

    onRegister() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) { return;}
      this.Register();
    },
    onReset() {
      this.form = {
        username: "",
        firstName: "",
        lastName: "",
        country: null,
        password: "",
        confirmedPassword: "",
        email: ""
      };
      this.$nextTick(() => {this.$v.$reset();});
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  max-width: 620px;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

}
.mt-2[data-v-86ab1514] {
    font-size: 20px;
}
.mt-2, .my-2 {
    margin-top: 1.5rem !important;
}

.btn-danger{
  background-color: gray;
  border-color: gray;
  border-radius: 8px;
  margin-right: 65px;
  margin-left: 45px;
  font-size: 1.2rem;
  margin-top: 30px;
}
.btn-danger:hover{
  background-color: rgb(96, 96, 96);
  border-color: rgb(96, 96, 96);
}
.btn-primary{
  background-color: green;
  border-color: green;
  border-radius: 8px;
  width: 350px;
  font-size: 1.2rem;
  margin-top: 30px;
}
.btn-primary:hover{
  background-color:rgb(2, 85, 2);
  border-color:rgb(2, 85, 2);
}
h1.title{
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 2.8rem;
  display: inline-block;
  border-bottom: 2px solid #42b983;
  margin-left: 150px;
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


</style>
