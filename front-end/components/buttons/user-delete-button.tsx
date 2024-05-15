"use client";
import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserSettingsForm from "../forms/user-settings-form";
import DeleteUserForm from "../forms/delete-user-settings-form";
import { number, string } from "zod";
interface UserSettings {
  userId: string;
}
const CreateUserButton = ({ userId }: UserSettings) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">Deletar sua conta</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete sua conta</DialogTitle>
            <DialogDescription>
              Essa ação não pode ser desfeita, após a confirmação sua conta
              deixará de existir em nosso banco de dados.
            </DialogDescription>
          </DialogHeader>
          {/* form  */}
          <DeleteUserForm userId={userId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateUserButton;
