// this should be replaced by useContext
import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const authInstance = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
    id: localStorage.getItem("id"),
  },
});
