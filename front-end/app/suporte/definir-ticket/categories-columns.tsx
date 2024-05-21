"use client";

import ModificationEye from "@/components/utils/modification-datetime-eye";
import { ColumnDef } from "@tanstack/react-table";
import DeleteDialog from "@/components/buttons/delete-dialog";
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
  name: string;
  color: string;
  responsibleId: number;
  createdAt: string;
  updatedAt: string;
};
export const columns: ColumnDef<TData>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "nome",
    header: "nome",
    cell: ({ row }) => {
      const category = row.original;

      return <p>{category.name}</p>;
    },
  },
  {
    accessorKey: "cor",
    header: "cor",
    cell: ({ row }) => {
      const category = row.original;
      const color = `text-[${category.color}]`;

      return <p className={color}>{category.color}</p>;
    },
  },
  {
    accessorKey: "criado por",
    // remove this, use it on email
    header: "criador por",
    cell: ({ row }) => {
      const category = row.original;

      return <p>{category.responsibleId}</p>;
    },
  },
  {
    accessorKey: "modificado",
    header: "modificado",
    cell: ({ row }) => {
      const category = row.original;
      //user create at date time
      return (
        <ModificationEye
          createdAtProps={category.createdAt}
          updatedAtProps={category.updatedAt}
          title="categoria"
        />
      );
    },
  },
  {
    id: "ações",
    header: "ações",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <>
          <div className="flex space-x-2">
            <DeleteDialog
              route="ticket-configs"
              title="item"
              params={category.id}
              paramsQuery="categories"
            />
          </div>
        </>
      );
    },
  },
];
