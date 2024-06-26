"use client";
import React, { useState } from "react";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authInstance } from "@/app/axios-config";
import { useRouter } from "next/navigation";
import { useToastContext } from "../utils/context-toast";
import LoaderButton from "../buttons/loader-button";
interface deleteUserPops {
  userId: number;
}
const UserDeleteForm = ({ userId }: deleteUserPops) => {
  const { ToastFail } = useToastContext();

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const deleteSchema = z.object({
    confirmation: z
      .string()
      .refine((data) => data === "DELETAR", { message: "Digite DELETAR" }),
  });

  const form = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      confirmation: "DELETAR",
    },
  });
  async function deleteUser() {
    setIsLoading(true);
    try {
      const { status, request } = await authInstance.delete(`user/${userId}`);
      if ((status ?? request.status) === 204) {
        router.push("/");
        localStorage.clear();
      }
    } catch (error) {
      ToastFail({
        description: "Error ao tentar deletar sua conta",
      });
      setIsLoading(false);
    }
  }
  return (
    <div className="">
      <Form {...form}>
        {/* html form, submit inputs registered by control*/}
        <form onSubmit={form.handleSubmit(deleteUser)} className="grid gap-4">
          <FormField
            // make sure we can acess the expected type. (fullName, email...)
            control={form.control}
            // ctrl+space should auto complete the name, default values
            name="confirmation"
            //field name to validate the form field input and save it for email
            render={({ field }) => (
              //a single field
              <FormItem>
                {/* what is shown to user */}
                <FormLabel>Para confirmar sua ação digite: DELETAR</FormLabel>
                {/* register, validate then save the input, linked to dataType in ...field*/}
                <FormControl>
                  <Input
                    placeholder="DELETAR"
                    className="focus-visible:ring-0 border-red-800"
                    {...field}
                  />
                </FormControl>
                {/* zod message */}
                <FormMessage />
              </FormItem>
            )}
          />
          {isLoading ? (
            <LoaderButton title={"Deletando"} />
          ) : (
            <Button
              variant="destructive"
              className="focus-visible:ring-0"
              disabled={isLoading}
            >
              Deletar conta
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default UserDeleteForm;
