"use client";
import { TData, columns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import AdminSideBar from "@/components/layout/admin-side-bar";
// import CreateUserButton from "./create-users-button";
import { CreateUserForm, ModalHandles } from "./create-user-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { PlusCircle } from "lucide-react";
import CreateButton from "@/components/buttons/create-button";
export default function DemoPage() {
  const modalRef = useRef<ModalHandles>(null);

  return (
    <>
      <AdminSideBar />
      <CreateUserForm ref={modalRef} />
      <div className="container pt-0 pl-20 pb-5">
        <DataTable
          columns={columns}
          filterColumn="email"
          route="user"
          showFilter={true}
          // generic
          component={
            <CreateButton
              title="usuário"
              action={() => modalRef.current?.handleOpen()}
            ></CreateButton>
          }
          // generic
          fromTable=""
        />
      </div>
    </>
  );
}
