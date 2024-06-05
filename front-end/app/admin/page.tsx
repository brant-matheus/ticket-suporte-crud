import React from "react";
import AdminSideBar from "@/components/layout/admin-side-bar";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import {} from "./columns";

const page = () => {
  return (
    <>
      <AdminSideBar />
      <div className="container pt-0 pl-20 pb-5">
        <DataTable
          component={null}
          showFilter={true}
          route="ticket"
          columns={columns}
          filterColumn="criado por"
          fromTable=""
        />
      </div>
    </>
  );
};

export default page;
