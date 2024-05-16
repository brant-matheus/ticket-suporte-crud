import React from "react";
import AdminSideBar from "@/components/layout/admin-side-bar";
import { authInstance } from "../axios-config";
const page = () => {
  return (
    <>
      <AdminSideBar onPage="home" />
    </>
  );
};

export default page;
