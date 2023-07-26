import axios from "axios";
// TODO: ... For Unit Test
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-type": "application/json",
  },
});

export default api;
