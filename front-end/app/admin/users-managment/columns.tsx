import { ColumnDef } from "@tanstack/react-table";
import DeleteDialog from "@/components/buttons/delete-dialog";
import ModificationEye from "@/components/utils/modification-datetime-eye";
import EditButton from "@/components/buttons/edit-button";
import { EditUserModalHandle } from "./edit-user-form";

// This type is used to define the shape of our data.
export type TData = {
  id: number;
  fullName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

interface UserManagmentProps {
  editUserModalRef: React.MutableRefObject<EditUserModalHandle | undefined>;
}
export function columns({
  editUserModalRef,
}: UserManagmentProps): ColumnDef<TData>[] {
  return [
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

        return (
          <>
            {" "}
            <div className="flex space-x-2">
              <DeleteDialog route="user" title="Usuário" params={user.id} />
              <EditButton
                action={() => {
                  editUserModalRef.current?.handleClick();
                  editUserModalRef.current?.setUserStateProps({
                    email: user.email,
                    fullName: user.fullName,
                    isAdmin: user.isAdmin,
                    userId: user.id,
                  });
                }}
              />
            </div>
          </>
        );
      },
    },
  ];
}
