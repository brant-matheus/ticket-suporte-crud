"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authInstance } from "@/app/axios-config";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface props {
  userId: number;
}

const PasswordFormEdit = ({ userId }: props) => {
  const [boolEditButton, setBoolEditButton] = useState(false);
  const { toast } = useToast();

  const editSchema = z
    .object({
      password: z
        .string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
          message:
            "8 digitos, caracter especial, letras maisculas e minusculas",
        }),
      passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "As senhas devem ser a mesma",
      path: ["passwordConfirmation"], // path of error
    });
  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });
  async function passwordRedefine(passwordForm: z.infer<typeof editSchema>) {
    setBoolEditButton(true);
    try {
      await authInstance.put(`user/${userId}`, passwordForm, {
        params: { isProfile: false },
      });
      setBoolEditButton(false);
      form.reset();
      toast({
        variant: "sucess",
        title: "senha editado com sucesso",
        description:
          "a senha foi editado com sucesso, envie a senha alterada para o usuário.",
      });
    } catch (error) {
      setBoolEditButton(false);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Error ao tentar alterar a senha, atualize a página e tente novamente.",
      });
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(passwordRedefine)}
        className="grid gap-4"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova senha</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="nova senha"
                ></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nova senha</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="confirmar nova senha"
                ></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={boolEditButton}
          className="flex content-center w-24"
        >
          Salvar
        </Button>
      </form>
    </Form>
  );
};

export default PasswordFormEdit;
