"use client";

import { ColumnDef } from "@tanstack/react-table";
import DeleteDialog from "@/components/buttons/delete-dialog";
import ModificationEye from "@/components/utils/modification-datetime-eye";
import { DateTime } from "luxon";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronsUpDown,
  CircleUserRound,
  LucideAArrowDown,
  MessagesSquare,
} from "lucide-react";
import { string } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface User {
  id: number;
  fullName: string;
  email: string;
  isAdmin: number;
  createdAt: string;
  updatedAt: string;
}

interface TicketConfig {
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
  finishedAt: string | null;
  user: User;
  ticketCategory: TicketConfig;
  ticketPriority: TicketConfig;
  ticketStatus: TicketConfig;
}

export const columns: ColumnDef<Ticket>[] = [
  { accessorKey: "id", header: "id do ticket" },
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

      return (
        <>
          <p style={color}>{item.ticketPriority.name}</p>
        </>
      );
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
    accessorKey: "finishedAt",
    header: "Concluido em",
    cell: ({ row }) => {
      const item = row.original;
      const updatedDate = DateTime.fromISO(item.updatedAt, {
        locale: "pt-BR",
      }).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
      return <p>{item.finishedAt ? updatedDate : "não concluido"}</p>;
    },
  },

  {
    accessorKey: "user.email",
    id: "user",
    header: "criado por",
    cell: ({ row }) => {
      const item = row.original;
      const createdDate = DateTime.fromISO(item.user.createdAt, {
        locale: "pt-BR",
      }).toLocaleString(DateTime.DATE_FULL);
      const updatedDate = DateTime.fromISO(item.user.updatedAt, {
        locale: "pt-BR",
      }).toLocaleString(DateTime.DATE_FULL);

      return (
        <>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost">{item.user.email}</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p> id do usuário: {item.user.id}</p>
                <p>nome completo: {item.user.fullName}</p>
                <p>usuário criado em: {createdDate}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      );
    },
  },
  {
    accessorKey: "modificated",
    header: "criado-modificado",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <>
          <ModificationEye
            createdAtProps={item.createdAt}
            title="ticket"
            updatedAtProps={item.updatedAt}
          />
        </>
      );
    },
  },
  {
    accessorKey: "content",
    header: "conteúdo",
    cell: ({ row }) => {
      const item = row.original;
      const [isOpen, setIsOpen] = useState(false);
      const [showCreateButton, setShowCreateButton] = useState(true);
      const [showCreateContent, setShowCreateContent] = useState(false);

      return (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">
                <MessagesSquare className="h-5 w-5 cursor-pointer" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="flex flex-col space-y-4">
                <div className="">
                  <p className="text-cyan-500">Assunto do ticket:</p>{" "}
                  <p>{item.subject}</p>
                </div>
                <div className="">
                  <p className="text-cyan-500">Descrição do ticket:</p>{" "}
                  <p>{item.description}</p>
                </div>
              </div>
              <Separator />
              <p>
                {item.ticketStatusId === 1 ? (
                  "Nenhuma operação criada"
                ) : (
                  <div className="flex justify-center">
                    <Button
                      variant="link"
                      onClick={() =>
                        window.open(
                          `/admin/operation-visualization/${item.id}`,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      Visualizar operações
                    </Button>
                  </div>
                )}
              </p>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
// collapse
