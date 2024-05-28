"use client";
import React, { useState } from "react";
import { GuestNavBar } from "@/components/layout/guest-side-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StoreTicketValidation, StoreTicketInfer } from "@/app/zod-validator";
import { zodResolver } from "@hookform/resolvers/zod";

const page = () => {
  const lengthLimit: number = 500;
  const [caracters, setCaracters] = useState(0);
  const form = useForm<StoreTicketInfer>({
    resolver: zodResolver(StoreTicketValidation),
    defaultValues: {
      category: "",
      description: "",
      priority: "",
      subject: "",
    },
  });
  async function storeTicket(ticket: StoreTicketInfer) {
    console.log(ticket);
  }
  return (
    <>
      <GuestNavBar />
      <div className="container flex justify-center ">
        <Card className="w-11/12 ">
          <CardHeader>
            <CardTitle>Envie seu ticket</CardTitle>
            <CardDescription>
              O assunto deve conter uma descrição breve do ticket, a descrição
              deve conter um relato rico em informações.
            </CardDescription>
          </CardHeader>
          <CardContent className="w-11/12">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(storeTicket)}
                className="grid gap-4"
              >
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assunto</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between">
                        Descrição{" "}
                        <p>Caracteres usados: {caracters} limite: 500</p>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...form.register("description")}
                          onChange={(e) => {
                            setCaracters(e.target.value.length);
                          }}
                          maxLength={lengthLimit}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button>Enviar</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default page;
