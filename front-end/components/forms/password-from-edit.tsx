"use client";
import {
  PasswordRedefinitionValidator,
  PasswordRedefinitionInfer,
} from "@/app/zod-validator";
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
import { useToastContext } from "../utils/context-toast";

interface props {
  closeDialog: any;
  userId: number;
}

const PasswordFormEdit = ({ closeDialog, userId }: props) => {
  const [boolEditButton, setBoolEditButton] = useState(false);
  const { toast } = useToast();
  const { ToastFail, ToastSuccess } = useToastContext();

  const form = useForm<PasswordRedefinitionInfer>({
    resolver: zodResolver(PasswordRedefinitionValidator),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });
  async function passwordRedefine(passwordForm: PasswordRedefinitionInfer) {
    setBoolEditButton(true);
    try {
      await authInstance.put(`user/${userId}`, passwordForm, {
        params: { isProfile: false },
      });
      if (typeof closeDialog === "function") {
        closeDialog();
      }
      setBoolEditButton(false);
      form.reset();
      ToastSuccess();
    } catch (error) {
      setBoolEditButton(false);
      ToastFail({ description: "Error ao redefinir a senha" });
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
