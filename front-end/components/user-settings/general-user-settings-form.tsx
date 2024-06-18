"use client";
import {
  UserInfoProfileInfer,
  UserInfoProfileValidator,
} from "@/validators/user";
import React, { useEffect, useMemo, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { literal, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authInstance } from "@/app/axios-config";
import { useToastContext } from "../utils/context-toast";
import LoaderButton from "../buttons/loader-button";
import { useRouter, usePathname } from "next/navigation";
const GeneralUserForm = () => {
  const pathName = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [userString, setUserString] = useState(localStorage.getItem("user"));
  const userObject = JSON.parse(userString!);

  const { ToastFail, ToastSuccess } = useToastContext();

  const form = useForm<UserInfoProfileInfer>({
    resolver: zodResolver(UserInfoProfileValidator),
    defaultValues: {
      fullName: userObject.fullName,
      email: userObject.email,
    },
  });

  async function editUser(editForm: UserInfoProfileInfer) {
    setIsLoading(true);
    if (
      editForm.email === userObject.email &&
      userObject.fullName == editForm.fullName
    ) {
      ToastFail({ description: "Nenhum campo preenchido" });
      setIsLoading(false);

      return true;
    }

    try {
      const { request, status, data } = await authInstance.put(
        `user/${userObject.id}`,
        editForm
      );
      if ((request.status ?? status) == 200) {
        const user = JSON.stringify(data.user);
        localStorage.setItem("user", user);
        setUserString(user);
        ToastSuccess();
      }
    } catch (error) {
      ToastFail({
        description: "Email já existe em nosso banco de dados, tente outro.",
      });
    }
    setIsLoading(false);
  }
  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(editUser)} className="grid gap-4">
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
                  <Input placeholder="seu email aqui" {...field} />
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

          {isLoading ? (
            <LoaderButton title={"Salvando edição"} />
          ) : (
            <Button>Salvar edição</Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default GeneralUserForm;
