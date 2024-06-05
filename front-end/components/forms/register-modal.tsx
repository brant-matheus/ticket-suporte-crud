"use client";
import {
  InternalRegisterValidator,
  InternalRegisterInfer,
} from "@/app/zod-validator";
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authInstance } from "@/app/axios-config";
import { useToast } from "@/components/ui/use-toast";
import LoaderButton from "../buttons/loader-button";
interface props {
  closeDialog: any;
}
const RegisterModal = ({ closeDialog }: props) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InternalRegisterInfer>({
    resolver: zodResolver(InternalRegisterValidator),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      isAdmin: "0",
    },
  });

  async function modalRegister(dataForm: InternalRegisterInfer) {
    setIsLoading(true);
    try {
      await authInstance.post("user", dataForm);
      closeDialog();

      setIsLoading(false);
      toast({
        variant: "sucess",
        title: "Usuário criado com sucesso.",
        description:
          "O usuário foi criado com sucesso, reinicie a página para visualizar a alteração",
      });

      form.reset();
    } catch (error) {
      setIsLoading(false);
      form.resetField("email");
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Error ao criar usuário, email já existente no banco de dados.",
      });
    }
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(modalRegister)}
          className="grid gap-4 "

          //make staus message invisible after typing
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="seu nome completo"></Input>
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
                  <Input {...field} placeholder="seu email"></Input>
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
                    placeholder="sua senha"
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
          {isLoading ? (
            <LoaderButton title={"Processando as informações "} />
          ) : (
            <Button>Cadastrar-se</Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default RegisterModal;
