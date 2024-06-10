"use client";
import { ColumnDef } from "@tanstack/react-table";
import DeleteDialog from "@/components/buttons/delete-dialog";
import ModificationEye from "@/components/utils/modification-datetime-eye";
import { DateTime } from "luxon";
import { formatIso } from "@/components/utils/formatIso";
import EditButton from "@/components/buttons/edit-button";
import { useRef } from "react";
import {
  ModalEditProps,
  EditTicketModal,
} from "@/components/edit-ticket/edit-ticket";
import CommentaryOperationButton from "@/components/buttons/commentary-operation-button";
interface TicketConfig {
  id: number;
  name: string;
  color: string;
  responsibleId: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  isAdmin: number;
  createdAt: string;
  updatedAt: string;
}

interface Ticket {
  id: number;
  createdById: number;
  subject: string;
  description: string;
  ticketCategoryId: number;
  ticketPriorityId: number;
  ticketStatusId: number;
  createdAt: string;
  updatedAt: string;
  isConclued: boolean;
  ticketCategory: TicketConfig;
  ticketPriority: TicketConfig;
  ticketStatus: TicketConfig;
  user: User;
}

export const columns: ColumnDef<Ticket>[] = [
  { accessorKey: "id", header: "Id do ticket" },
  {
    accessorKey: "ticketCategory",
    header: "Categoria",
    cell: ({ row }) => {
      const item = row.original;
      const color = { color: item.ticketCategory.color };

      return <p style={color}>{item.ticketCategory.name}</p>;
    },
  },
  {
    accessorKey: "ticketPriority",
    header: "Prioridade",
    cell: ({ row }) => {
      const item = row.original;
      const color = { color: item.ticketPriority.color };

      return <p style={color}>{item.ticketPriority.name}</p>;
    },
  },
  {
    accessorKey: "ticketStatus",
    header: "status",
    cell: ({ row }) => {
      const item = row.original;
      const color = { color: item.ticketStatus.color };

      return <p style={color}>{item.ticketStatus.name}</p>;
    },
  },
  {
    accessorKey: "modificatedAt",
    header: "modificado em",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <>
          <ModificationEye
            createdAtProps={item.createdAt}
            updatedAtProps={item.updatedAt}
            title="ticket"
          />
        </>
      );
    },
  },
  {
    accessorKey: "isConclued",
    header: "Concluido em",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <>
          {item.isConclued ? formatIso(item.updatedAt) : <p>Não conclusivo</p>}
        </>
      );
    },
  },
  {
    id: "action",
    header: "ações",
    cell: ({ row }) => {
      const item = row.original;
      const modalRef = useRef<ModalEditProps>(null);
      return (
        <>
          <div className="flex items-center gap-x-1">
            <EditTicketModal ref={modalRef} />

            <DeleteDialog
              route="ticket"
              title="ticket"
              params={item.id}
              fromTableWhere="
        "
            />
            <EditButton
              action={() =>
                modalRef.current?.handleCLick({
                  title: "categoria",
                  fromTable: "categories",
                  isAdmin: item.user.isAdmin,
                  ticketId: item.id,
                })
              }
            />
            <CommentaryOperationButton
              action={() =>
                window.open(
                  `/guest/chat-area/${item.id}`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            />
          </div>
        </>
      );
    },
  },
];
