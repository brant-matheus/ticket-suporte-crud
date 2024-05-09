"use client";
import React, { useEffect } from "react";
import AdminSideBar from "@/components/layout/admin-side-bar";
import { authInstance } from "../axios-config";
const page = () => {
  useEffect(() => {
    async function teste() {
      try {
        const { data } = await authInstance.get("user");
        console.log(
          typeof data.id,
          typeof data.isAdmin,
          typeof data.createdAt,
          data.createdAt
        );
      } catch (error) {
        console.log(error);
      }
    }
    teste();
  }, []);

  return (
    <>
      <AdminSideBar onPage="home" />
    </>
  );
};

export default page;
