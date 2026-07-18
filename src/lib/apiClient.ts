import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN } from "@/config/constants";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export default apiClient;