"use client";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToastContext } from "@/components/utils/context-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordFormEdit from "@/components/forms/password-from-edit";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GeneralUsersValidator, GeneralUsersInfer } from "@/app/zod-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { authInstance } from "@/app/axios-config";

export interface EditModalHandles {
  handleClick: Function;
}

interface FormProps {
  fullName?: string;
  email: string;
  isAdmin: number;
  userId: number;
}

export const EditUserForm = forwardRef((props, ref) => {
  const [stateProps, setStateProps] = useState<FormProps>();

  useImperativeHandle(ref, () => ({
    handleClick(props: FormProps) {
      setStateProps(props);
      setOpen(true);
    },
  }));
  function closeDialog() {
    setOpen(false);
  }
  const { ToastFail, ToastSuccess } = useToastContext();

  const [boolEditButton, setBoolEditButton] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<GeneralUsersInfer>({
    resolver: zodResolver(GeneralUsersValidator),
  });

  async function userEdit(editForm: GeneralUsersInfer) {
    setBoolEditButton(true);
    try {
      await authInstance.put(`user/${stateProps?.userId}`, editForm, {
        params: {
          isProfile: false,
        },
      });
      closeDialog();
      ToastSuccess();
    } catch (error) {
      setBoolEditButton(false);
      ToastFail({ description: "Email existente!" });
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">Informações editar</TabsTrigger>
              <TabsTrigger value="password">Redefinir senha</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <Card>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(userEdit)}
                      className="grid gap-4"
                    >
                      <FormField
                        defaultValue={stateProps?.fullName}
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
                        defaultValue={stateProps?.email}
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
                        defaultValue={stateProps?.isAdmin.toString()}
                        control={form.control}
                        shouldUnregister
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
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardContent>
                  <PasswordFormEdit closeDialog={closeDialog} userId={1} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
});