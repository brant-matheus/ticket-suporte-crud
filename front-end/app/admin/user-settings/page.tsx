import React from "react";
import AdminSideBar from "@/components/layout/admin-side-bar";
import UserSettings from "@/components/user-settings/user-settings";
const page = () => {
  return (
    <>
      <AdminSideBar />
      <UserSettings />
    </>
  );
};

export default page;
