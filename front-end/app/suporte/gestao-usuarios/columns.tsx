"use client";

import { ColumnDef } from "@tanstack/react-table";
import DeleteDialog from "@/components/buttons/delete-dialog";
import EditButton from "./edit-button";
import { ArrowUpDown, MoreHorizontal, Eye, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    accessorKey: "createdAt",
    header: "modificado",
    cell: ({ row }) => {
      const user = row.original;
      //user create at date time
      const createdAt = DateTime.fromISO(user.createdAt, {
        locale: "pt-BR",
      }).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);

      // user update at date time
      const updateAt = DateTime.fromISO(user.updatedAt, {
        locale: "pt-BR",
      }).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost">
                <Eye />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="">
                <p>usuário criado em: {createdAt}</p>
                {updateAt === createdAt ? (
                  <p>usuário ainda não foi editado</p>
                ) : (
                  <p>usuário editado em: {updateAt}</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
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
