import { TData, columns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import AdminSideBar from "@/components/layout/admin-side-bar";
import CreateUserButton from "./create-users-button";
export default async function DemoPage() {
  return (
    <>
      <AdminSideBar onPage="users-managment" />
      <div className="container pt-0 pl-20 pb-5">
        <DataTable
          columns={columns}
          filterColumn="email"
          route="user"
          showFilter={true}
          component={<CreateUserButton />}
        />
      </div>
    </>
  );
}
