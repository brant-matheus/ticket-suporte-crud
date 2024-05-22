"use client";

import { ColumnDef } from "@tanstack/react-table";
import DeleteDialog from "@/components/buttons/delete-dialog";
import EditButton from "./edit-users-button";
import { ArrowUpDown, MoreHorizontal, Eye, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ModificationEye from "@/components/utils/modification-datetime-eye";
// This type is used to define the shape of our data.
export type TData = {
  id: number;
  fullName: string;
  email: string;
  isAdmin: number;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<TData>[] = [
  {
    accessorKey: "id",
    header: "id do usuário",
  },
  {
    accessorKey: "nome",
    header: "nome completo",
    cell: ({ row }) => {
      const user = row.original;

      return <p>{user.fullName}</p>;
    },
  },
  {
    accessorKey: "email",
    header: "email",
  },
  {
    accessorKey: "permissão",
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
    accessorKey: "modificado",
    header: "modificado",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <ModificationEye
          title="Usuário"
          createdAtProps={user.createdAt}
          updatedAtProps={user.updatedAt}
        />
      );
    },
  },
  {
    id: "ações",
    header: "ações",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <>
          <div className="flex space-x-2">
            <DeleteDialog
              route="user"
              title="Usuário"
              params={user.id}
              fromTable=""
              tableId=""
            />
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
