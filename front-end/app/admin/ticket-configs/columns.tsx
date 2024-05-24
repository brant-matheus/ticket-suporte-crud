// id
// name + cor
// responsibleId EMAIL
// modificado
// action

"use client";
import { ColumnDef } from "@tanstack/react-table";
import ModificationEye from "@/components/utils/modification-datetime-eye";
import DeleteDialog from "@/components/buttons/delete-dialog";
interface responsible {
  id: number;
  fullName: string;
  email: string;
  isAdmin: number;
  createdAt: string;
  updatedAt: string;
}
export type TData = {
  id: number;
  name: string;
  color: string;
  responsible: responsible;
  createdAt: string;
  updatedAt: string;
};

interface TicketConfigsProps {
  title: string;
  fromTableWhere: string;
}

export function ticketConfigsColumns({
  title,
  fromTableWhere,
}: TicketConfigsProps): ColumnDef<TData>[] {
  return [
    { accessorKey: "id", header: "id" },
    {
      accessorKey: "name",
      header: "name",
      cell: ({ row }) => {
        const item = row.original;
        const color = { color: item.color };

        return <p style={color}>{item.name}</p>;
      },
    },
    {
      accessorKey: "responsible",
      header: "criado por",
      cell: ({ row }) => {
        const item = row.original;
        return <>{item.responsible.email}</>;
      },
    },
    {
      accessorKey: "modification",
      header: "modificado",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <>
            <ModificationEye
              createdAtProps={item.createdAt}
              title={title}
              updatedAtProps={item.updatedAt}
            />
          </>
        );
      },
    },
    {
      id: "action",
      header: "ação",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <>
            <DeleteDialog
              fromTableWhere={fromTableWhere}
              params={item.id}
              route="ticket-configs"
              title={title}
              key={item.id}
            />
          </>
        );
      },
    },
  ];
}
