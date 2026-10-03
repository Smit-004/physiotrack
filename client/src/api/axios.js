import axios from "axios";

// withCredentials: true => browser login cookie ko har request ke saath bhejta hai
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export default api;