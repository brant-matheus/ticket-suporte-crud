"use client";
import { GeneralUserValidation, GeneralUserInfer } from "@/app/zod-validator";
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
import { useToastContext } from "../utils/context-toast";

interface UserSettings {
  userId: string;
}

const GeneralUserForm = ({ userId }: UserSettings) => {
  const [boolEditButton, setBoolEditButton] = useState(false);
  const { ToastFail, ToastSuccess } = useToastContext();
  const form = useForm<GeneralUserInfer>({
    resolver: zodResolver(GeneralUserValidation),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });
  async function editUser(editForm: GeneralUserInfer) {
    const isEmpty = Object.values(editForm).every(
      (x) => x === null || x === ""
    );
    if (isEmpty) {
      ToastFail({ description: "Nenhum campo preenchido" });

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
      ToastSuccess();
      setBoolEditButton(false);
    } catch (error) {
      ToastFail({
        description: "Email já existe em nosso banco de dados, tente outro.",
      });
      setBoolEditButton(false);
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

export default GeneralUserForm;
