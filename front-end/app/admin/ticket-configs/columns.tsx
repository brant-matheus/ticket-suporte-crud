// id
// name + cor
// responsibleId EMAIL
// modificado
// action

"use client";
import { ModalHandles, TicketConfigForm } from "./edit-ticket-configs-form";
import DisabledDeleteButton from "@/components/buttons/disabled-delete-button";
import { ColumnDef } from "@tanstack/react-table";
import ModificationEye from "@/components/utils/modification-datetime-eye";
import DeleteDialog from "@/components/buttons/delete-dialog";
import EditButton from "@/components/buttons/edit-button";
import { useRef } from "react";
import { Delete, Trash2 } from "lucide-react";
import DisabledEditButton from "@/components/buttons/disabled-edit-button";
import { Button } from "@/components/ui/button";
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
  fromTable: string;
}

export function ticketConfigsColumns({
  title,
  fromTableWhere,
  fromTable,
}: TicketConfigsProps): ColumnDef<TData>[] {
  return [
    { accessorKey: "id", header: "id" },
    {
      accessorKey: "name",
      header: "name",
      cell: ({ row }) => {
        const item = row.original;
        const color = { color: item.color };

        return (
          <p style={color}>
            <Button variant="ghost">{item.name}</Button>
          </p>
        );
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
        const modalRef = useRef<ModalHandles>(null);

        return (
          <div className="flex space-x-2">
            <TicketConfigForm ref={modalRef} />
            {item.name === "pendente" ? (
              <>
                <DisabledDeleteButton />
                <DisabledEditButton />
              </>
            ) : (
              <>
                <DeleteDialog
                  fromTableWhere={fromTableWhere}
                  params={item.id}
                  route="ticket-configs"
                  title={title}
                  key={item.id}
                />
                <EditButton
                  action={() =>
                    modalRef.current?.handleClick({
                      ticketConfigName: item.name,

                      title: title,
                      params: item.id,
                      fromTable: fromTable,
                    })
                  }
                />
              </>
            )}
          </div>
        );
      },
    },
  ];
}
