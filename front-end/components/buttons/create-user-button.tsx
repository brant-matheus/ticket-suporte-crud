"use client";
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RegisterModal from "../forms/register-modal";
const CreateUserButton = () => {
  const [open, setOpen] = useState(false);
  function closeDialog() {
    setOpen(false);
  }
  return (
    <div >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-4 w-4" /> Criar Usuário
          </Button>
        </DialogTrigger>
        <DialogContent>
          {/* form  */}
          <RegisterModal closeDialog={closeDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateUserButton;
