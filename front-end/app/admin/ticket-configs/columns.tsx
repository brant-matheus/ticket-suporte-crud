"use client";
import { Badge } from "@/components/ui/badge";

import DeleteDialog from "@/components/buttons/delete-dialog";
import DisabledDeleteButton from "@/components/buttons/disabled-delete-button";
import DisabledEditButton from "@/components/buttons/disabled-edit-button";
import EditButton from "@/components/buttons/edit-button";
import ModificationEye from "@/components/utils/modification-datetime-eye";
import { ColumnDef } from "@tanstack/react-table";
import { useRef } from "react";
import { ModalHandles, TicketConfigForm } from "./edit-ticket-configs-form";
import BadgeColumn from "@/components/utils/badgeColumn";
interface responsible {
  id: number;
  fullName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Color {
  id: number;
  name: string;
  hex: string;
}
export type TData = {
  id: number;
  name: string;
  color: Color;
  responsible: responsible;
  createdAt: string;
  updatedAt: string;
};

interface TicketConfigsProps {
  title: string;
}

export function ticketConfigsColumns({
  title,
}: TicketConfigsProps): ColumnDef<TData>[] {
  return [
    { accessorKey: "id", header: "id" },
    {
      accessorKey: "name",
      id: "nome",
      header: "nome",
      cell: ({ row }) => {
        const item = row.original;

        return BadgeColumn({
          title: item.name,
          hex: item.color.hex,
        });
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
