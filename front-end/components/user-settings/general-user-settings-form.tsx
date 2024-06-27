"use client";
import { authInstance } from "@/app/axios-config";
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
import {
  UserInfoProfileInfer,
  UserInfoProfileValidator,
} from "@/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LoaderButton from "../buttons/loader-button";
import { useToastContext } from "../utils/context-toast";

interface User {
  id: number;
  fullName: string;
  email: string;
  isAdmin: boolean;
}

const GeneralUserForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  // const [isPageLoading, setIsPageLoading] = useState(true);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [fullName, setFullName] = useState(localStorage.getItem("fullName"));

  const { ToastFail, ToastSuccess } = useToastContext();

  const form = useForm<UserInfoProfileInfer>({
    resolver: zodResolver(UserInfoProfileValidator),
    defaultValues: {
      fullName: localStorage.getItem("fullName")!,
      email: localStorage.getItem("email")!,
    },
  });

  async function editUser(editForm: UserInfoProfileInfer) {
    setIsLoading(true);
    if (editForm.email === email! && fullName == editForm.fullName) {
      ToastFail({ description: "Nenhum campo preenchido" });
      setIsLoading(false);

      return true;
    }

    try {
      const { request, status, data } = await authInstance.put(
        `user/${userId}`,
        editForm
      );
      if ((request.status ?? status) == 200) {
        localStorage.setItem("userId", data.id);
        localStorage.setItem("email", data.email);
        localStorage.setItem("fullName", data.fullName);

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
