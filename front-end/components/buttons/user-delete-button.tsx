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
import UserSettingsForm from "../user-settings/general-user-settings-form";
import DeleteUserForm from "../user-settings/delete-user-settings-form";
import { number, string } from "zod";
interface UserSettings {
  userId: string;
}
const DeleteUserButton = () => {
  const userId = localStorage.getItem("userId");
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
          <DeleteUserForm userId={parseInt(userId!)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteUserButton;
