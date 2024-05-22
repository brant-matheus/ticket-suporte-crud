"use client";

import ModificationEye from "@/components/utils/modification-datetime-eye";
import { ColumnDef } from "@tanstack/react-table";
import DeleteDialog from "@/components/buttons/delete-dialog";
import { ArrowUpDown, MoreHorizontal, Eye, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
// This type is used to define the shape of our data.
export type TData = {
  id: number;
  name: string;
  color: string;
  responsibleId: number;
  createdAt: string;
  updatedAt: string;
};
export const prioritiesColumns: ColumnDef<TData>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "nome",
    header: "nome",
    cell: ({ row }) => {
      const priority = row.original;

      return <p>{priority.name}</p>;
    },
  },
  {
    accessorKey: "cor",
    header: "cor",
    cell: ({ row }) => {
      const priority = row.original;
      const color = `text-[${priority.color}]`;

      return <p className={color}>{priority.color}</p>;
    },
  },
  {
    accessorKey: "criado por",
    // remove this, use it on email
    header: "criador por",
    cell: ({ row }) => {
      const priority = row.original;

      return <p>{priority.responsibleId}</p>;
    },
  },
  {
    accessorKey: "modificado",
    header: "modificado",
    cell: ({ row }) => {
      const priority = row.original;
      //user create at date time
      return (
        <ModificationEye
          createdAtProps={priority.createdAt}
          updatedAtProps={priority.updatedAt}
          title="prioridade"
        />
      );
    },
  },
  {
    id: "ações",
    header: "ações",
    cell: ({ row }) => {
      const priority = row.original;
      return (
        <>
          <div className="flex space-x-2">
            <DeleteDialog
              route="ticket-configs"
              title="item"
              params={priority.id}
              paramsQuery="priorities"
            />
          </div>
        </>
      );
    },
  },
];
