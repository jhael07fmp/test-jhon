import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://172.20.10.4:5000", // tu IP local + puerto de Flask
  timeout: 5000, // tiempo máximo de espera
});

export default api;
