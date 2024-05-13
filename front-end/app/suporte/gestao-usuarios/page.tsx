import { TData, columns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import AdminSideBar from "@/components/layout/admin-side-bar";
import CreateUserButton from "@/components/buttons/create-user-button";

export default async function DemoPage() {
  return (
    <>
      <div className="absolute top-0 right-0 mt-[105px] mr-48 ">
        <CreateUserButton />
      </div>
      <AdminSideBar onPage="users-managment" />
      <div className="container mx-auto p-20 ">
        <DataTable columns={columns} filterColumn="email" route="user" />
      </div>
    </>
  );
}
