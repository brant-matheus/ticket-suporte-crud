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
import { useAuth } from "./authentication-context";
import { ModeToggle } from "@/components/ui/theme-toggle";

import { usePathname } from "next/navigation";
import { useToastContext } from "@/components/utils/context-toast";
import LoaderButton from "@/components/buttons/loader-button";

export default function Login() {
  const { userLogin } = useAuth();
  //loginError sets after request fails
  const [loginError, setLoginError] = useState("");
  //disable/enable login button after submit
  const [isLoading, setIsLoading] = useState(false);

  //define zod schema with validation
  const formSchema = z.object({
    email: z.string().email({ message: "email inválido" }),
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
    setIsLoading(true);
    const status = await userLogin(loginForm);
    if (status === 400) {
      setIsLoading(false);
      setLoginError("*Error no login, confira suas credenciais");
      form.resetField("password");
    }
  }

  return (
    <div>
      <div className="flex justify-center items-center h-screen ">
        {/*our shadow box, w size large*/}
        <Card className="w-full max-w-lg">
          {/* card title font size 2xl*/}
          <CardHeader>
            <ModeToggle />

            <CardTitle className="text-2xl text-center">Login</CardTitle>
          </CardHeader>
          {/* what goes inside our shadow box */}
          <CardContent>
            {/* shadcn ui Form, {...form} const form which has useForm. */}
            <Form {...form}>
              {/* html form, submit inputs registered by control*/}
              <form onSubmit={form.handleSubmit(login)} className="grid gap-4">
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
                  // make sure we can acess the expected type. (fullName, email...)
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
                {isLoading ? (
                  <LoaderButton title={"Entrando"} />
                ) : (
                  <Button>Entrar</Button>
                )}

                <p className="text-[red]">{loginError}</p>
                <p>
                  Não possui conta ?{" "}
                  <Link href="/register" className="text-blue-500">
                    Criar sua conta
                  </Link>{" "}
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
