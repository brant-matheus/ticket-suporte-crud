"use client";

import { ColumnDef } from "@tanstack/react-table";
import DeleteDialog from "@/components/buttons/delete-dialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UsersData = {
  id: number;
  fullName: string;
  email: string;
  isAdmin: number;
};

export const columns: ColumnDef<UsersData>[] = [
  {
    accessorKey: "id",
    header: "id do usuário",
  },
  {
    accessorKey: "fullName",
    header: "nome completo",
  },
  {
    accessorKey: "email",
    header: "email",
  },
  {
    accessorKey: "isAdmin",
    header: "Permissão",
    cell: ({ row }) => {
      const user = row.original;
      var permission = "administrador";
      if (!user.isAdmin) {
        permission = "guest";
      }

      return <p>{permission}</p>;
    },
  },
  {
    id: "action",
    header: "ações",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <>
          <DeleteDialog
            route="user"
            title="Usuário"
            params={user.id}
            key={user.id}
          />
        </>
      );
    },
  },
];
