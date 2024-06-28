import CommentaryOperationButton from "@/components/buttons/commentary-operation-button";
import DeleteDialog from "@/components/buttons/delete-dialog";
import EditButton from "@/components/buttons/edit-button";
import BadgeColumn from "@/components/utils/badgeColumn";
import { formatIso } from "@/components/utils/formatIso";
import ModificationEye from "@/components/utils/modification-datetime-eye";
import { ColumnDef } from "@tanstack/react-table";
import { EditTicketModalHandles } from "./edit-ticket-form";

interface Color {
  name: string;
  hex: string;
}

interface TicketConfig {
  id: number;
  name: string;
  color: Color;
  responsibleId: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  isAdmin: boolean;
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

interface EditTicketModalProps {
  EditTicketModalHandles: React.MutableRefObject<
    EditTicketModalHandles | undefined
  >;
}

export function columns({
  EditTicketModalHandles,
}: EditTicketModalProps): ColumnDef<Ticket>[] {
  return [
    { accessorKey: "id", header: "Id do ticket" },
    {
      accessorKey: "ticketCategory",
      id: "Categoria",

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
      id: "Prioridade",

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
      accessorKey: "modificatedAt",
      id: "modificado em",
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
      id: "concluído",
      header: "Concluido em",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <>
            {item.isConclued ? (
              formatIso(item.updatedAt)
            ) : (
              <p>Não conclusivo</p>
            )}
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
              <DeleteDialog route="ticket" title="ticket" params={item.id} />
              <EditButton
                action={() => {
                  EditTicketModalHandles.current?.handleClick();
                  EditTicketModalHandles.current?.setTicketProps({
                    ticketCategory: item.ticketCategory.name,
                    ticketDescription: item.description,
                    ticketId: item.id,
                    ticketPriority: item.ticketPriority.name,
                    ticketSubject: item.subject,
                  });
                }}
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
}
