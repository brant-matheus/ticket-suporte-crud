"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { authInstance } from "@/app/axios-config";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { string } from "zod";
import { register } from "module";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const UserDeleteButton = () => {
  const deleteSchema = z.object({
    confirmation: z.string().refine((data) => data === "DELETAR"),
  });
  // criar zod object para colocar strict, usar zod resolver
  const { register, handleSubmit } = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
  });

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">deletar sua conta</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>DELETAR SUA CONTA PERMANENTEMENTE</DialogTitle>
            <DialogDescription>
              Essa ação não pode ser desfeita, ao confirmar, sua conta será
              permanentemente deletada do nosso banco de dados.
            </DialogDescription>
          </DialogHeader>
          <form onClick={() => console.log(1)}>
            <Label>Confirme sua ação digitando "DELETAR"</Label>
            <Input
              className="border-2 border-rose-500 focus-visible:ring-0"
              placeholder="DELETAR"
              {...register("confirmation")}
            ></Input>
            <Button type="submit" variant="destructive">
              Deletar conta
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDeleteButton;
