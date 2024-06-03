// this should be replaced by useContext
"use client";
import axios from "axios";

// var API_URL = process.env.NEXT_PUBLIC_API_URL;
var API_URL = "http://localhost:3333"
export const instance = axios.create({
  baseURL: API_URL,
});

export const authInstance = axios.create({
  baseURL: API_URL,
});
