import React from "react";
import AdminSideBar from "@/components/layout/admin-side-bar";
import CreateUserButton from "@/components/buttons/create-user-button";
const page = () => {
  return (
    <>
      <AdminSideBar onPage="users-managment" />
      <CreateUserButton />
    </>
  );
};

export default page;
