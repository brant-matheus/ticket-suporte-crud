"use client";

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

      return <p>{category.color}</p>;
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
      const createdAt = DateTime.fromISO(category.createdAt, {
        locale: "pt-BR",
      }).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);

      // user update at date time
      const updateAt = DateTime.fromISO(category.updatedAt, {
        locale: "pt-BR",
      }).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);

      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="cursor-default">
                <Eye />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="">
                <p>categoria criado em: {createdAt}</p>
                {updateAt === createdAt ? (
                  <p>categoria ainda não foi editado</p>
                ) : (
                  <p>categoria editado em: {updateAt}</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
