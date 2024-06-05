"use client";

import { ColumnDef } from "@tanstack/react-table";
import DeleteDialog from "@/components/buttons/delete-dialog";
import ModificationEye from "@/components/utils/modification-datetime-eye";
import { EditUserForm, EditModalHandles } from "./edit-user-form";
import { useRef } from "react";
import EditButton from "@/components/buttons/edit-button";

// This type is used to define the shape of our data.
export type TData = {
  id: number;
  fullName: string;
  email: string;
  isAdmin: number;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<TData>[] = [
  {
    accessorKey: "id",
    header: "id do usuário",
  },
  {
    accessorKey: "fullName",
    header: "nome completo",
    id: "nome",
  },
  {
    accessorKey: "email",
    header: "email",
  },
  {
    accessorKey: "isAdmin",
    id: "permissão",
    // remove this, use it on email
    header: "permissão",
    cell: ({ row }) => {
      const user = row.original;
      var permission = "administrador";
      if (!user.isAdmin) {
        permission = "guest";
      }

      return <p>{permission}</p>;
    },
  },
  {
    id: "modificado",
    header: "modificado",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <ModificationEye
          title="Usuário"
          createdAtProps={user.createdAt}
          updatedAtProps={user.updatedAt}
        />
      );
    },
  },
  {
    id: "ações",
    header: "ações",
    cell: ({ row }) => {
      const user = row.original;
      const modalRef = useRef<EditModalHandles>(null);
      return (
        <>
          {" "}
          <EditUserForm ref={modalRef} />
          <div className="flex space-x-2">
            <DeleteDialog
              route="user"
              title="Usuário"
              params={user.id}
              fromTableWhere=""
            />
            <EditButton
              action={() =>
                modalRef.current?.handleClick({
                  fullName: user.fullName,
                  email: user.email,
                  isAdmin: user.isAdmin,
                  userId: user.id,
                })
              }
            />
          </div>
        </>
      );
    },
  },
];
