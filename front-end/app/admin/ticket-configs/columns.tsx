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
  isAdmin: boolean;
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
  fromTable,
}: TicketConfigsProps): ColumnDef<TData>[] {
  return [
    { accessorKey: "id", header: "id" },
    {
      accessorKey: "name",
      id: "nome",
      header: "nome",
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
      accessorKey: "responsible.email",
      id: "criado por",
      header: "criado por",
    },
    {
      id: "modificado",
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
      id: "ações",
      header: "ações",
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
                  params={item.id}
                  route="ticket-configs"
                  title={title}
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
