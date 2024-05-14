// this should be replaced by useContext
"use client";
import axios from "axios";

var API_URL = process.env.NEXT_PUBLIC_API_URL;
export const instance = axios.create({
  baseURL: API_URL,
});

var token;
var userId;
try {
  token = `Bearer ${localStorage.getItem("token")}`;
  userId = localStorage.getItem("userId");
} catch (error) {
  token = null;
  userId = null;
}

export const authInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: token,
    userId: userId,
  },
});
