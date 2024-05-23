"use client";
import { GeneralUsersValidator, GeneralUsersInfer } from "@/app/zod-validator";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { any, number, z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authInstance } from "@/app/axios-config";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface props {
  fullName: string;
  email: string;
  isAdmin: number;
  closeDialog: any; //function
  userId: number;
}
const GeneralFormEdit = ({
  fullName,
  email,
  isAdmin,
  closeDialog,
  userId,
}: props) => {
  const [boolEditButton, setBoolEditButton] = useState(false);
  const { toast } = useToast();

  const form = useForm<GeneralUsersInfer>({
    resolver: zodResolver(GeneralUsersValidator),
    defaultValues: {
      fullName: `${fullName}`,
      email: `${email}`,
      // the problem might be here
      isAdmin: isAdmin.toString(),
    },
  });
  async function userEdit(editForm: GeneralUsersInfer) {
    setBoolEditButton(true);
    try {
      await authInstance.put(`user/${userId}`, editForm, {
        params: {
          isProfile: false,
        },
      });
      closeDialog();
      toast({
        variant: "sucess",
        title: "usuário editado com sucesso",
        description:
          "O usuário foi editado com sucesso, atualize a página para ver o resultado.",
      });
    } catch (error) {
      setBoolEditButton(false);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Error: Usuário inexistente, digitação errada ou email já existente.",
      });
    }
  }
  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(userEdit)} className="grid gap-4">
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
                  <FormLabel>Nome completo</FormLabel>
                  {/* register, validate then save the input, linked to dataType in ...field*/}
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Email</FormLabel>
                  {/* register, validate then save the input, linked to dataType in ...field*/}
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  {/* zod message */}
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="isAdmin"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Permissões do usuário</FormLabel>

                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="0"></RadioGroupItem>
                        </FormControl>
                        <FormLabel className="">Cliente</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1"></RadioGroupItem>
                        </FormControl>
                        <FormLabel>Administrador</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <Button type="submit" disabled={boolEditButton}>
              Salvar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GeneralFormEdit;
