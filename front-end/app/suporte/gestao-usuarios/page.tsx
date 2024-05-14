import { TData, columns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import AdminSideBar from "@/components/layout/admin-side-bar";
import CreateUserButton from "@/components/buttons/create-user-button";

export default async function DemoPage() {
  return (
    <>
      <div className="pt-4 pl-20  ">
        <CreateUserButton />
      </div>
      <AdminSideBar onPage="users-managment" />
      <div className="container  pt-4 pl-20 pb-5">
        <DataTable
          columns={columns}
          filterColumn="email"
          route="user"
          showFilter={true}
        />
      </div>
    </>
  );
}
