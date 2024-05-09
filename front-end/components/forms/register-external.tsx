"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { instance } from "@/app/axios-config";
const RegisterExternal = () => {
  //loginError sets after request fails
  const [loginError, setLoginError] = useState("");
  //disable/enable login button after submit
  const [loginButton, setLoginButton] = useState(false);

  //define zod schema with validation
  const formSchema = z
    .object({
      fullName: z
        .string()
        .regex(/^[A-Za-z-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/, {
          message: "Nome deve conter apenas letras, com ou sem acentos!",
        }),
      email: z
        .string()
        .regex(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, {
          message:
            "Email deve conter nome e dominio, exemplo: nome@dominio.com",
        })
        .trim()
        .toLowerCase(),
      password: z
        .string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
          message:
            "Senha deve conter pelo menos 8 digitos contendo números, letras maisculas e minusculas, e caracter especial",
        }),
      passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Senhas devem ser a mesma",
      path: ["passwordConfirmation"], // path of error
    });

  //redicte user to routes
  const router = useRouter();

  //controll, handle submit typed by formSchema. {email: string, password: string}
  const form = useForm<z.infer<typeof formSchema>>({
    //validate input
    resolver: zodResolver(formSchema),
    //for each form field, MUST have to have a deafult values.
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  //loginForm is typed by formSchema. {email: string, password: string}
  async function RegisterForm(externalPostUser: z.infer<typeof formSchema>) {
    setLoginButton(true);
    try {
      const { data } = await instance.post("/externalUser", externalPostUser);
      if (data === false) {
        router.push("guest");
      }
    } catch (error) {
      setLoginButton(false);
      form.resetField("email");
      setLoginError("*Email já existe no Banco de dados");
    }
  }
  return (
    <div className="flex justify-center items-center h-screen">
      {/*our shadow box*/}
      <Card className="w-full max-w-lg">
        {/* card title font size 2xl*/}
        <CardHeader>
          <CardTitle className="text-2xl text-center">Cadastra-se</CardTitle>
        </CardHeader>
        {/* what goes inside our shadow box */}
        <CardContent>
          {/* shadcn ui Form, {...form} const form which has useForm. */}
          <Form {...form}>
            {/* html form, submit inputs registered by control*/}
            <form
              onSubmit={form.handleSubmit(RegisterForm)}
              className="grid gap-4"
            >
              <FormField
                // controll save input
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
                // controll save input
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
                      <Input placeholder="seu email" {...field} />
                    </FormControl>
                    {/* zod message */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                // controll save input
                control={form.control}
                // ctrl+space should auto complete the name, default values
                name="password"
                //field name to validate the form field input and save it for email
                render={({ field }) => (
                  //a single field
                  <FormItem>
                    {/* what is shown to user */}
                    <FormLabel>Senha</FormLabel>
                    {/* register, validate then save the input, linked to dataType in ...field*/}
                    <FormControl>
                      <Input
                        placeholder="sua senha"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    {/* zod message */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                // controll save input
                control={form.control}
                // ctrl+space should auto complete the name, default values
                name="passwordConfirmation"
                //field name to validate the form field input and save it for email
                render={({ field }) => (
                  //a single field
                  <FormItem>
                    {/* what is shown to user */}
                    <FormLabel>Confirmar senha</FormLabel>
                    {/* register, validate then save the input, linked to dataType in ...field*/}
                    <FormControl>
                      <Input
                        placeholder="confirme sua senha"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    {/* zod message */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={loginButton}>
                Cadastrar
              </Button>
              <p className="text-[red]">{loginError}</p>
              <p>
                Já possui conta ?{" "}
                <Link href="/" className="text-[blue]">
                  Entrar aqui
                </Link>{" "}
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterExternal;
