import { Badge } from "@/components/ui/badge";

import DeleteDialog from "@/components/buttons/delete-dialog";
import DisabledDeleteButton from "@/components/buttons/disabled-delete-button";
import DisabledEditButton from "@/components/buttons/disabled-edit-button";
import EditButton from "@/components/buttons/edit-button";
import ModificationEye from "@/components/utils/modification-datetime-eye";
import { ColumnDef } from "@tanstack/react-table";

import BadgeColumn from "@/components/utils/badgeColumn";
import { EditTicketConfigHandles } from "./edit-ticket-configs-form";
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
  route: string;
  ticketConfigEdit: React.MutableRefObject<EditTicketConfigHandles | undefined>;
}

export function ticketConfigsColumns({
  title,
  route,
  ticketConfigEdit,
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

        return (
          <div className="flex space-x-2">
            {["pendente", "concluido"].includes(item.name) ? (
              <>
                <DisabledDeleteButton />
                <DisabledEditButton />
              </>
            ) : (
              <>
                <DeleteDialog params={item.id} route={route} title={title} />
                <EditButton
                  action={() => {
                    ticketConfigEdit.current?.handleClick();
                    ticketConfigEdit.current?.setStateProps({
                      ticketConfigName: item.name,
                      route: route,
                      title: title,
                      params: item.id,
                    });
                  }}
                />
              </>
            )}
          </div>
        );
      },
    },
  ];
}
