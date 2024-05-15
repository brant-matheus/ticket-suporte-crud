"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { literal, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authInstance } from "@/app/axios-config";

interface UserSettings {
  userId: string;
}

const UserSettingsForm = ({ userId }: UserSettings) => {
  const [boolEditButton, setBoolEditButton] = useState(false);
  const { toast } = useToast();
  const editSchema = z.object({
    fullName: z
      .string()
      .toLowerCase()
      .trim()
      .regex(/^[A-Za-z-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/, {
        message: "Nome deve conter apenas letras, com ou sem acentos!",
      })
      .optional()
      .or(z.literal("")),

    email: z
      .string()
      .toLowerCase()
      .trim()
      .regex(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: "deve conter nome e dominio, exemplo: email@email.com",
      })
      .optional()
      .or(z.literal("")),
  });

  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });
  async function editUser(editForm: z.infer<typeof editSchema>) {
    const isEmpty = Object.values(editForm).every(
      (x) => x === null || x === ""
    );
    if (isEmpty) {
      toast({
        variant: "default",
        title: "Inválido",
        description: "Nenhum campo preenchido.",
      });
      return true;
    }
    // get all typed/validated inputs
    setBoolEditButton(true);
    try {
      const { request, status, data } = await authInstance.put(
        `user/${userId}`,
        editForm,
        { params: { isProfile: true } }
      );
      form.reset();
      toast({
        variant: "sucess",
        title: "Sucesso",
        description: "Informações editadas com sucesso",
      });
      setBoolEditButton(false);
    } catch (error) {
      setBoolEditButton(false);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao editar usuário, tente novamente",
      });
    }
  }

  return (
    <div className="">
      <Form {...form}>
        {/* html form, submit inputs registered by control*/}
        <form onSubmit={form.handleSubmit(editUser)} className="grid gap-4">
          <FormField
            // make sure we can acess the expected type. (fullName, email...)
            control={form.control}
            // ctrl+space should auto complete the name, default values
            name="fullName"
            //field name to validate the form field input and save it for email
            render={({ field }) => (
              //a single field
              <FormItem>
                {/* what is shown to user */}
                <FormLabel>nome completo</FormLabel>
                {/* register, validate then save the input, linked to dataType in ...field*/}
                <FormControl>
                  <Input placeholder="seu nome completo" {...field} />
                </FormControl>
                {/* zod message */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            // make sure we can acess the expected type. (fullName, email...)
            control={form.control}
            // ctrl+space should auto complete the name, default values
            name="email"
            //field name to validate the form field input and save it for email
            render={({ field }) => (
              //a single field
              <FormItem>
                {/* what is shown to user */}
                <FormLabel>email</FormLabel>
                {/* register, validate then save the input, linked to dataType in ...field*/}
                <FormControl>
                  <Input placeholder="seu email aqui" {...field} />
                </FormControl>
                {/* zod message */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="flex content-center w-24"
            type="submit"
            disabled={boolEditButton}
          >
            Salvar
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserSettingsForm;
