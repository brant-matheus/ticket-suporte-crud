"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
/* 
'use client' client server, not server side.
'useState', disable login button after submit.
zodResolver, input validation.
useForm, controll / handleSubmit. register and submit registered input
z, validation schema, infer data type
card = "shadow box",
form 
instance, axios instance
useRouter, redirect
Link, redirect after click
*/

export default function Login() {
  //loginError sets after request fails
  const [loginError, setLoginError] = useState("");
  //disable/enable login button after submit
  const [loginButton, setLoginButton] = useState(false);

  //define zod schema with validation
  const formSchema = z.object({
    email: z.string().regex(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, {
      message: "Email inválido!",
    }),
    password: z.string().min(1, { message: "senha obrigatória" }),
  });

  //redicte user to routes
  const router = useRouter();

  //controll, handle submit typed by formSchema. {email: string, password: string}
  const form = useForm<z.infer<typeof formSchema>>({
    //validate input
    resolver: zodResolver(formSchema),
    //for each form field, MUST have to have a deafult values.
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function login(loginForm: z.infer<typeof formSchema>) {
    setLoginButton(true);
    try {
      const { data } = await instance.post("auth", loginForm);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("token", data.token.token);

      if (data.isAdmin) {
        router.push("/suporte");
      } else {
        router.push("/guest");
      }
    } catch (error) {
      setLoginButton(false);
      setLoginError("*Error no login, confira suas credenciais");
      form.resetField("password");
      console.log(error);
    }
  }

  return (
    // center our item, h and v.
    <div className="flex justify-center items-center h-screen">
      {/*our shadow box, w size large*/}
      <Card className="w-full max-w-lg">
        {/* card title font size 2xl*/}
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        {/* what goes inside our shadow box */}
        <CardContent>
          {/* shadcn ui Form, {...form} const form which has useForm. */}
          <Form {...form}>
            {/* html form, submit inputs registered by control*/}
            <form onSubmit={form.handleSubmit(login)} className="grid gap-4">
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
                // controll saves input
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
              <Button className="w-full" type="submit" disabled={loginButton}>
                Login
              </Button>
              <p className="text-[red]">{loginError}</p>
              <p>
                Não possui conta ?{" "}
                <Link href="/cadastro" className="text-[blue]">
                  Criar sua conta
                </Link>{" "}
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
