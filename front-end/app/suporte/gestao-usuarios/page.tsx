import { UsersData, columns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import AdminSideBar from "@/components/layout/admin-side-bar";
import CreateUserButton from "@/components/buttons/create-user-button";
async function getData(): Promise<UsersData[]> {
  // Fetch data from your API here.
  return [
    {
      id: 3,
      fullName: "suporte sagatech",
      email: "editaresseusuario@hotmail.com",
      isAdmin: 0,
    },
    {
      id: 4,
      fullName: "suporte sagatech",
      email: "zara@hotmail.com",
      isAdmin: 1,
    },
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <>
      <div className="absolute top-0 right-0 mt-[105px] mr-48 ">
        <CreateUserButton />
      </div>
      <AdminSideBar onPage="users-managment" />
      <div className="container mx-auto p-20 ">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
