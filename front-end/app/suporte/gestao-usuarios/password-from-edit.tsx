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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface props {
  closeDialog: any;
  userId: number;
}

const PasswordFormEdit = ({ closeDialog, userId }: props) => {
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
    console.log(passwordForm);
    try {
      await authInstance.put(`user/${userId}`, passwordForm);
      closeDialog();
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
    <Card>
      <CardContent>
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
            <Button type="submit" disabled={boolEditButton}>
              Salvar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PasswordFormEdit;
