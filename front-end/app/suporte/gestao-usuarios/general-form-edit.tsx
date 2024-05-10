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
import { z } from "zod";
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
const FormEdit = ({ fullName, email, isAdmin, closeDialog, userId }: props) => {
  const [boolEditButton, setBoolEditButton] = useState(false);
  const { toast } = useToast();
  const editSchema = z.object({
    fullName: z
      .string()
      .regex(/^[A-Za-z-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/, {
        message: "Nome deve conter apenas letras, com ou sem acentos!",
      }),
    email: z
      .string()
      .regex(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: "Email deve conter nome e dominio, exemplo: nome@dominio.com",
      })
      .trim()
      .toLowerCase(),
    isAdmin: z.enum(["0", "1"]),
  });
  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      fullName: `${fullName}`,
      email: `${email}`,
      isAdmin: isAdmin.toString()! as string,
    },
  });
  async function userEdit(editForm: z.infer<typeof editSchema>) {
    // convert key value
    if (editForm["isAdmin"] === "0") {
      editForm["isAdmin"] = 0;
    } else {
      editForm["isAdmin"] = 1;
    }

    setBoolEditButton(true);
    try {
      await authInstance.put(`user/${userId}`, editForm);
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
          "O usuário não existe em nosso banco de dados, atualize a página.",
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
                      onChange={field.onChange}
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
              Editar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormEdit;
