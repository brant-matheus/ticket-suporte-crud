// this should be replaced by useContext
"use client";
import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const authInstance = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    userId: localStorage.getItem("userId"),
  },
});
