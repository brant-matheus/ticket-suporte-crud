"use client";

import { EditModalProps, EditTicketForm } from "./edit-ticket-form";
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
  Send,
  ArrowUpFromLine,
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
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import ActionCreateButton from "@/components/buttons/action-create-button";

import EditButton from "@/components/buttons/edit-button";
import CommentaryOperationButton from "@/components/buttons/commentary-operation-button";
import { formatIso } from "@/components/utils/formatIso";
import { CreateTicketOperation, ModalProps } from "./create-operation-form";

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
  { accessorKey: "id", header: "id do ticket", id: "id do ticket" },
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
    id: "prioridade",
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
    id: "status",
    header: "status",
    cell: ({ row }) => {
      const item = row.original;
      const color = { color: item.ticketStatus.color };

      return <p style={color}>{item.ticketStatus.name}</p>;
    },
  },
  {
    accessorKey: "finishedAt",
    id: "concluido em",
    header: "Concluido em",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <p>{item.finishedAt ? formatIso(item.updatedAt) : "não concluido"}</p>
      );
    },
  },

  {
    accessorKey: "user.email",
    id: "criado por",
    header: "criado por",
    cell: ({ row }) => {
      const item = row.original;

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
                <p>usuário criado em: {formatIso(item.createdAt)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      );
    },
  },
  {
    accessorKey: "modificated",
    id: "criado-modificado",
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
    id: "conteúdo",
    header: "conteúdo",
    cell: ({ row }) => {
      const item = row.original;
      const [isOpen, setIsOpen] = useState(false);
      const [showCreateButton, setShowCreateButton] = useState(true);
      const [showCreateContent, setShowCreateContent] = useState(false);
      const modalRef = useRef<ModalProps>();

      return (
        <>
          <CreateTicketOperation ref={modalRef} />

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              <div className="flex justify-center">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    modalRef.current?.handleClick({ ticketId: item.id });
                  }}
                >
                  Cadastrar nova operação
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
  {
    id: "ações",
    header: "ações",
    cell: ({ row }) => {
      const item = row.original;
      const modalRef = useRef<ModalProps>();
      const editRef = useRef<EditModalProps>();
      return (
        <>
          <EditTicketForm ref={editRef} />
          <CreateTicketOperation ref={modalRef} />
          <div className="flex items-center gap-x-1">
            <ActionCreateButton
              action={() =>
                modalRef.current?.handleClick({ ticketId: item.id })
              }
            />
            <EditButton action={() => editRef.current?.handleClick()} />
            <CommentaryOperationButton action={() => {}} />
          </div>
        </>
      );
    },
  },
];
// collapse
