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
import { Separator } from "../ui/separator";
const UserSettingsForm = () => {
  const [boolEditButton, setBoolEditButton] = useState(false);
  const { toast } = useToast();
  const editSchema = z.object({
    fullName: z
      .string()
      .regex(/^[A-Za-z-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/, {
        message: "Nome deve conter apenas letras, com ou sem acentos!",
      })
      .optional()
      .or(z.literal("")),
  });

  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      fullName: "",
    },
  });
  async function editUser(editForm: z.infer<typeof editSchema>) {
    console.log(editForm, editForm["fullName"]?.length);
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

          <Button className="flex content-center w-24" type="submit">
            Salvar
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserSettingsForm;
