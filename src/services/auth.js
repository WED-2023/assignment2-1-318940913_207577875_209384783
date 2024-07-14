// src/services/auth.js
import axios from 'axios';
const API_URL = 'http://127.0.0.1:80';

  // export function mockLogin(credentials, success = true) {
  //   // Check if already logged in
  //   if (!success) {
  //     throw { status: 409, response: { data: { message: "A user is already logged in", success: false } } };
  //   }

  //   // If all checks pass, return a success message
  //   return { status: 200, response: { data: { message: "login succeeded", success: true}} };
  // }
  

  // export function mockRegister(userDetails, success = true) {

  //   if (!success) {
  //     throw { status: 409, response: { data: { message: "Username taken", success: false } } };
  //   }
  
  //   return { status: 200, response: { data: { message: "user created", success: true}} };
  // }
  


  // export function mockLogout() {
  //   return { status: 200, response: { data: { message: "logout succeeded", success: true}} };

  // }

  // ------------------------------------- Server Connection !!!! ----------------------------------------------
  export async function logInServer(credentials) {
    try {
      const response = await axios.post(`${API_URL}/Login`, credentials,{
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
  
  export async function logOutServer() {
    try {
      const response = await axios.post(`${API_URL}/Logout`,{
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  export async function registerServer(user_info) {
    console.log(user_info);
    try {
      const response = await axios.post(`${API_URL}/Register`,{
        username: user_info.username,
        firstname: user_info.firstName,
        lastname: user_info.lastName,
        country: user_info.country,
        password: user_info.password,
        email: user_info.email
      });
      return response;
    } catch (error) {
      console.error('Error register:', error);
      throw error;
    }
  }

  // ------------------------------------------------------------------------------------
  

