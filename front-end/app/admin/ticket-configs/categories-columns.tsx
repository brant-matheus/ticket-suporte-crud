"use client";

import ModificationEye from "@/components/utils/modification-datetime-eye";
import { ColumnDef } from "@tanstack/react-table";
import DeleteDialog from "@/components/buttons/delete-dialog";
import { ArrowUpDown, MoreHorizontal, Eye, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditButton from "@/components/buttons/edit-button";
import { instance } from "@/app/axios-config";
// This type is used to define the shape of our data.
interface responsible {
  id: number;
  fullName: string;
  email: string;
  isAdmin: number;
  createdAt: string;
  updatedAt: string;
}
export type TData = {
  id: number;
  name: string;
  color: string;
  responsible: responsible;
  createdAt: string;
  updatedAt: string;
};

interface CategoryColumnsProps {
  editAction: Function;
}

export function categoriesColumns(editAction: Function): ColumnDef<TData>[] {
  return [
    {
      accessorKey: "id",
      header: "id",
    },
    {
      accessorKey: "nome",
      header: "nome",
      cell: ({ row }) => {
        const item = row.original;

        const color = { color: item.color };

        return <p style={color}>{item.name}</p>;
      },
    },

    {
      accessorKey: "criado por",
      // remove this, use it on email
      header: "criador por",
      cell: ({ row }) => {
        const category = row.original;

        return <p>{category.responsible.email}</p>;
      },
    },
    {
      accessorKey: "modificado",
      header: "modificado",

      cell: ({ row }) => {
        const category = row.original;
        //user create at date time
        return (
          <ModificationEye
            createdAtProps={category.createdAt}
            updatedAtProps={category.updatedAt}
            title="categoria"
          />
        );
      },
    },
    {
      id: "ações",
      header: "ações",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <>
            <div className="flex space-x-2">
              <DeleteDialog
                route="ticket-configs"
                title="categoria"
                params={category.id}
                fromTable="categories"
                tableId="category_id"
              />
              <EditButton action={editAction} />
            </div>
          </>
        );
      },
    },
  ];
}

// export const categoriesColumns: ColumnDef<TData>[] = [
//   {
//     accessorKey: "id",
//     header: "id",
//   },
//   {
//     accessorKey: "nome",
//     header: "nome",
//     cell: ({ row }) => {
//       const item = row.original;

//       const color = { color: item.color };

//       return <p style={color}>{item.name}</p>;
//     },
//   },

//   {
//     accessorKey: "criado por",
//     // remove this, use it on email
//     header: "criador por",
//     cell: ({ row }) => {
//       const category = row.original;

//       return <p>{category.responsible.email}</p>;
//     },
//   },
//   {
//     accessorKey: "modificado",
//     header: "modificado",
//     cell: ({ row }) => {
//       const category = row.original;
//       //user create at date time
//       return (
//         <ModificationEye
//           createdAtProps={category.createdAt}
//           updatedAtProps={category.updatedAt}
//           title="categoria"
//         />
//       );
//     },
//   },
//   {
//     id: "ações",
//     header: "ações",
//     cell: ({ row }) => {
//       const category = row.original;
//       return (
//         <>
//           <div className="flex space-x-2">
//             <DeleteDialog
//               route="ticket-configs"
//               title="categoria"
//               params={category.id}
//               fromTable="categories"
//               tableId="category_id"
//             />
//             <EditButton action={() => {}} />
//           </div>
//         </>
//       );
//     },
//   },
// ];
