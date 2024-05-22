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
export const statusesColumns: ColumnDef<TData>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "nome",
    header: "nome",
    cell: ({ row }) => {
      const item = row.original;

      const color = { color: item.color };

      return <p style={color}>{item.name}</p>;
    },
  },

  {
    accessorKey: "criado por",
    // remove this, use it on email
    header: "criador por",
    cell: ({ row }) => {
      const status = row.original;

      return <p>{status.responsibleId}</p>;
    },
  },
  {
    accessorKey: "modificado",
    header: "modificado",
    cell: ({ row }) => {
      const status = row.original;
      //user create at date time
      return (
        <ModificationEye
          createdAtProps={status.createdAt}
          updatedAtProps={status.updatedAt}
          title="status"
        />
      );
    },
  },
  {
    id: "ações",
    header: "ações",
    cell: ({ row }) => {
      const status = row.original;
      return (
        <>
          <div className="flex space-x-2">
            <DeleteDialog
              route="ticket-configs"
              title="status"
              params={status.id}
              fromTable="statuses"
              tableId="status_id"
            />
          </div>
        </>
      );
    },
  },
];
