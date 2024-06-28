import ActionCreateButton from "@/components/buttons/action-create-button";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ModificationEye from "@/components/utils/modification-datetime-eye";
import { ColumnDef } from "@tanstack/react-table";
import { MutableRefObject } from "react";
import { ModalEditProps } from "./edit-ticket";

import CommentaryOperationButton from "@/components/buttons/commentary-operation-button";
import EditButton from "@/components/buttons/edit-button";
import BadgeColumn from "@/components/utils/badgeColumn";
import { formatIso } from "@/components/utils/formatIso";
import { ModalHandles } from "./create-operation-form";
import { ShowTicketModalHandles } from "./show-ticket-modal";

interface Color {
  name: string;
  hex: string;
}
interface User {
  id: number;
  fullName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TicketConfig {
  id: number;
  name: string;
  color: Color;
  responsibleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
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
  user: User;
  ticketCategory: TicketConfig;
  ticketPriority: TicketConfig;
  ticketStatus: TicketConfig;
}

export function columns(
  modalRefCreateOperation: MutableRefObject<ModalHandles | undefined>,
  showTicketModalRef: MutableRefObject<ShowTicketModalHandles | undefined>,
  EditTicketModalRef: MutableRefObject<ModalEditProps | undefined>
): ColumnDef<Ticket>[] {
  return [
    { accessorKey: "id", header: "id do ticket", id: "id do ticket" },
    {
      accessorKey: "ticketCategory",
      header: "Categoria",
      cell: ({ row }) => {
        const item = row.original;

        return BadgeColumn({
          title: item.ticketCategory.name,
          hex: item.ticketCategory.color.hex,
        });
      },
    },
    {
      accessorKey: "ticketPriority",
      id: "prioridade",
      header: "Prioridade",
      cell: ({ row }) => {
        const item = row.original;

        return BadgeColumn({
          title: item.ticketPriority.name,
          hex: item.ticketPriority.color.hex,
        });
      },
    },
    {
      accessorKey: "ticketStatus",
      id: "status",
      header: "status",
      cell: ({ row }) => {
        const item = row.original;

        return BadgeColumn({
          title: item.ticketStatus.name,
          hex: item.ticketStatus.color.hex,
        });
      },
    },
    {
      accessorKey: "isConclued",
      id: "concluido em",
      header: "Concluido em",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <p>{item.isConclued ? formatIso(item.updatedAt) : "não concluido"}</p>
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
      id: "ações",
      header: "ações",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <>
            <div className="flex items-center gap-x-1">
              <ActionCreateButton
                action={() =>
                  modalRefCreateOperation.current?.handleClick({
                    ticketId: item.id,
                  })
                }
              />
              <ActionCreateButton
                action={() => {
                  showTicketModalRef.current?.setTicket(item);
                  showTicketModalRef.current?.handleClick({
                    ticketId: item.id,
                  });
                }}
              />
              <EditButton
                action={() =>
                  EditTicketModalRef.current?.handleCLick({
                    item: item,
                  })
                }
              />
              <CommentaryOperationButton
                action={() =>
                  window.open(
                    `/admin/chat-area/${item.id}`,
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
}
// collapse
