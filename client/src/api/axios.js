import axios from "axios";

// Online me VITE_API_URL se aayega, local me neeche wala fallback chalega
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default api;