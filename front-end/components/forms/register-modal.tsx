"use client";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authInstance } from "@/app/axios-config";
const RegisterModal = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [sucess, setSucess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [loginButton, setLoginButton] = useState(false);
  const formSchema = z
    .object({
      // a to z, A to Z, acentos, remove start and end space, lowercase
      fullName: z
        .string()
        .regex(/^[A-Za-z-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/, {
          message: "apenas letras, com ou sem acentos!",
        })
        .trim()
        .min(5)
        .toLowerCase(),
      email: z
        .string()
        .regex(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, {
          message: "deve conter nome e dominio, exemplo: email@email.com",
        })
        .trim()
        .toLowerCase(),
      password: z
        .string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
          message:
            "8 digitos, caracter especial, letras maisculas e minusculas",
        }),
      passwordConfirmation: z.string(),
      isAdmin: z.enum(["0", "1"]),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "As senhas devem ser a mesma",
      path: ["passwordConfirmation"], // path of error
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      isAdmin: "0",
    },
  });

  async function modalRegister(dataForm: z.infer<typeof formSchema>) {
    setLoginButton(true);
    console.log(dataForm);
    try {
      await authInstance.post("user", dataForm);
      setLoginButton(false);
      setSucess(true);
      form.reset();
    } catch (error) {
      setLoginButton(false);
      setError(true);
      setErrorMessage("*Email existente!");
      form.resetField("email");
    }
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(modalRegister)}
          className="grid gap-4 "
          onKeyUp={() => {
            setError(false);
            setSucess(false);
          }}
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

          <Button type="submit" className=" h-10 gap-1" disabled={loginButton}>
            <PlusCircle className="h-4 w-4" />
            <div className="text-[15px]">Cadastrar</div>
          </Button>
          {sucess ? (
            <p className="text-green-700">*Usuário criado com sucesso</p>
          ) : null}
          {error ? <p className="text-red-600">{errorMessage}</p> : null}
        </form>
      </Form>
    </div>
  );
};

export default RegisterModal;
