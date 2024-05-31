"use client";
import { ColumnDef } from "@tanstack/react-table";
import DeleteDialog from "@/components/buttons/delete-dialog";
import ModificationEye from "@/components/utils/modification-datetime-eye";
import { DateTime } from "luxon";

interface TicketCategory {
  id: number;
  name: string;
  color: string;
  responsibleId: number;
  createdAt: string;
  updatedAt: string;
}

interface TicketPriority {
  id: number;
  name: string;
  color: string;
  responsibleId: number;
  createdAt: string;
  updatedAt: string;
}

interface TicketStatus {
  id: number;
  name: string;
  color: string;
  responsibleId: number;
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
  finishedAt: string;
  ticketCategory: TicketCategory;
  ticketPriority: TicketPriority;
  ticketStatus: TicketStatus;
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

      return <p style={color}>{item.ticketPriority.name}</p>;
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
    accessorKey: "finishedAt",
    header: "Concluido em",
    cell: ({ row }) => {
      const item = row.original;
      const date = DateTime.fromISO(item.finishedAt, {
        locale: "pt-BR",
      }).toFormat("dd-MM-yyyy HH:mm");
      return (
        <>{item.finishedAt === null ? <p>Não conclusivo</p> : <p>{date}</p>}</>
      );
    },
  },
];
