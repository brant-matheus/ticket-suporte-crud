"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { StoreUserValidator, StoreUserInfer } from "@/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authInstance } from "@/app/axios-config";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PlusCircle } from "lucide-react";
import { useToastContext } from "@/components/utils/context-toast";
import LoaderButton from "@/components/buttons/loader-button";
export interface ModalHandles {
  handleOpen: Function;
}

export const CreateUserForm = forwardRef((props, ref) => {
  const { ToastFail, ToastSuccess } = useToastContext();

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  useImperativeHandle(ref, () => ({
    handleOpen() {
      handleOpen();
    },
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const form = useForm<StoreUserInfer>({
    resolver: zodResolver(StoreUserValidator),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      isAdmin: "false",
    },
  });

  async function modalRegister(dataForm: StoreUserInfer) {
    setIsLoading(true);

    try {
      await authInstance.post("user", dataForm);
      setIsLoading(false);
      setOpen(false);
      form.reset();
      ToastSuccess();
    } catch (error) {
      setIsLoading(false);
      form.resetField("email");
      ToastFail({
        description: "email já existe em nosso banco de dados, tente outro.",
      });
    }
  }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(modalRegister)}
              className="grid gap-4 "
              //make staus message invisible after typing
              onKeyUp={() => setEmailError("")}
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="nome completo"></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="email"></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="senha"
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
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="confirme sua senha"
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                <LoaderButton title={"Cadastrando usuário"} />
              ) : (
                <Button className=" h-10 gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <p className="text-[15px]">Cadastrar</p>
                </Button>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
});

CreateUserForm.displayName = "Create user form";
