"use client";
import { TData, columns } from "./columns";
import { DataTable } from "@/components/table/data-table";
import AdminSideBar from "@/components/layout/admin-side-bar";
// import CreateUserButton from "./create-users-button";
import RegisterModal from "../../../components/forms/register-modal";
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
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import CreateButton from "@/components/buttons/create-button";
export default function DemoPage() {
  const [open, setOpen] = useState(false);
  function closeDialog() {
    setOpen(false);
  }
  return (
    <>
      {/* not generic */}
      <AdminSideBar />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <RegisterModal closeDialog={closeDialog} />
        </DialogContent>
      </Dialog>
      {/* not generic */}
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
              action={() => setOpen(true)}
            ></CreateButton>
          }
          // generic
          fromTable=""
        />
      </div>
    </>
  );
}
