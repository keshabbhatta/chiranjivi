import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  let token = sessionStorage.getItem("vidhyalaya-app-token");
  if (!token) {
    token = localStorage.getItem("vidhyalaya-app-token") || localStorage.getItem("token");
  }

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;