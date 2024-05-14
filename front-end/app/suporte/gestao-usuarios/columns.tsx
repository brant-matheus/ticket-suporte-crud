"use client";

import { ColumnDef } from "@tanstack/react-table";
import DeleteDialog from "@/components/buttons/delete-dialog";
import EditButton from "./edit-button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

// This type is used to define the shape of our data.
export type TData = {
  id: number;
  fullName: string;
  email: string;
  isAdmin: number;
};

export const columns: ColumnDef<TData>[] = [
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
    // remove this, use it on email
    header: "permissão",

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
          <div className="flex space-x-2">
            <DeleteDialog route="user" title="Usuário" params={user.id} />
            <EditButton
              fullName={user.fullName}
              email={user.email}
              isAdmin={user.isAdmin}
              userId={user.id}
            />
          </div>
        </>
      );
    },
  },
];
