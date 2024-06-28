"use client";
import { authInstance } from "@/app/axios-config";
import LoaderButton from "@/components/buttons/loader-button";
import PasswordFormEdit from "@/components/forms/password-from-edit";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToastContext } from "@/components/utils/context-toast";
import { PutUserInfer, PutUserValidator } from "@/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";

export interface EditUserModalHandle {
  handleClick: () => void;
  // setUserStateProps: (props: EditUserProps) => void;
  setUserStateProps: (props: EditUserProps) => void;
}

interface EditUserProps {
  fullName: string;
  email: string;
  isAdmin: boolean;
  userId: number;
}

export const EditUserForm = forwardRef((props, ref) => {
  const [stateProps, setStateProps] = useState<EditUserProps>();
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    handleClick() {
      setOpen(true);
    },
    setUserStateProps(props: EditUserProps) {
      setStateProps(props);
    },
  }));
  function closeDialog() {
    setOpen(false);
  }
  const { ToastFail, ToastSuccess } = useToastContext();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PutUserInfer>({
    resolver: zodResolver(PutUserValidator),
  });

  async function userEdit(editForm: PutUserInfer) {
    setIsLoading(true);
    try {
      await authInstance.put(`user/${stateProps?.userId}`, editForm);
      closeDialog();
      ToastSuccess();
    } catch (error) {
      setIsLoading(false);
      ToastFail({ description: "Email existente!" });
    }
  }
  useEffect(() => {
    form.reset();
  }, [open, form]);
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
                      {" "}
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
                        defaultValue={stateProps?.isAdmin ? "true" : "false"}
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
                                    <RadioGroupItem value="false"></RadioGroupItem>
                                  </FormControl>
                                  <FormLabel className="">Cliente</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="true"></RadioGroupItem>
                                  </FormControl>
                                  <FormLabel>Administrador</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      ></FormField>
                      {isLoading ? (
                        <LoaderButton title={"Salvando edição "} />
                      ) : (
                        <Button>Salvar edição</Button>
                      )}
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardContent>
                  <PasswordFormEdit
                    closeDialog={closeDialog}
                    userId={stateProps?.userId!}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
});

EditUserForm.displayName = "edit user form";
