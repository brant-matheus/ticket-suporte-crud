import React from "react";
import AdminSideBar from "@/components/layout/admin-side-bar";
import { DataTable } from "@/components/table/data-table";
import { categoriesColumns, TData } from "./categories-columns";
const page = () => {
  return (
    <>
      <AdminSideBar onPage="set-ticket" />
      <DataTable
        columns={categoriesColumns}
        component={null}
        showFilter={false}
        filterColumn=""
        fromTable="categories"
        route="ticket-configs"
      />
    </>
  );
};

export default page;
