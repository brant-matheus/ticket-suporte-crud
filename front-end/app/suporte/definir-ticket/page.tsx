import React from "react";
import AdminSideBar from "@/components/layout/admin-side-bar";
const page = () => {
  return (
    <>
      <AdminSideBar onPage="set-ticket" />
    </>
  );
};

export default page;
