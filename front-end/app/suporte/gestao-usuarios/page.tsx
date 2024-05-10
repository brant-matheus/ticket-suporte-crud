import { UsersData, columns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import AdminSideBar from "@/components/layout/admin-side-bar";
import CreateUserButton from "@/components/buttons/create-user-button";
async function getData(): Promise<UsersData[]> {
  // Fetch data from your API here.
  return [
    {
      id: 2,
      fullName: "suporte sagatech",
      email: "editaresseusuario@hotmail.com",
      isAdmin: 0,
    },
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <>
      <CreateUserButton />
      <AdminSideBar onPage="users-managment" />
      <div className="container mx-auto p-44">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
