import axios from "axios";

// Create an instance of axios with a base URL for the local API
const API = axios.create({
  baseURL: "http://localhost:8080/api/",
});

// Function to handle user signup
export const UserSignUp = async (data) => {
  try {
    const response = await API.post("/user/signup", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Error during signup");
  }
};

// Function to handle user signin
export const UserSignIn = async (data) => {
  try {
    const response = await API.post("/user/login", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Error during signin");
  }
};

// Function to fetch all users
export const getUsers = async () => {
  try {
    const response = await API.get("/user");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Error fetching users");
  }
};

// Function to fetch a single user by ID
export const getUser = async (id) => {
  try {
    const response = await API.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Error fetching user");
  }
};

// Function to create a new user
export const createUser = async (data) => {
  try {
    const response = await API.post("/user/signup", data); // Adjust endpoint if necessary
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Error creating user");
  }
};

// Function to update an existing user by ID
export const updateUser = async (id, data) => {
  try {
    const response = await API.put(`/user/${id}`, data); // Adjust endpoint if necessary
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Error updating user");
  }
};

// Function to delete a user by ID
export const deleteUser = async (id) => {
  try {
    const response = await API.delete(`/user/${id}`); // Adjust endpoint if necessary
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Error deleting user");
  }
};
