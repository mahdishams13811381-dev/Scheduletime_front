import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const login = async (username, password) => {
  const response = await API.post("/user/login", {
    username,
    password,
  });

  return response.data;
};