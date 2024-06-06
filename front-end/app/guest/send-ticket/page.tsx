"use client";
import React, { useCallback, useEffect, useState } from "react";
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
import { authInstance } from "@/app/axios-config";
import { useToastContext } from "@/components/utils/context-toast";
import LoaderButton from "@/components/buttons/loader-button";

interface TicketProps {
  name: string;
  color: string;
  id: number;
}

interface DataProps {
  categories: TicketProps[];
  priorities: TicketProps[];
}
const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { ToastFail, ToastSuccess } = useToastContext();
  const [data, setData] = useState<DataProps>();
  const getData = useCallback(async () => {
    try {
      const { data } = await authInstance.get("ticket-configs");
      setData(data);
    } catch (error) {}
  }, []);
  useEffect(() => {
    getData();
  }, []);

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
    setIsLoading(true);
    try {
      const { data, request } = await authInstance.post("ticket", ticket);
      ToastSuccess();
      setIsLoading(false);
      form.reset();
    } catch (error) {
      setIsLoading(false);

      ToastFail({
        description:
          "Error ao enviar o ticket, reinice a página e tente novamente.",
      });
    }
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
              deve conter um relato detalhado.
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
                          // don't use register, do something else, like not using register and set value with set
                          onChange={(e) => {
                            setCaracters(e.target.value.length);
                            if (e.target.value.length >= 50) {
                              form.setValue("description", e.target.value, {
                                shouldValidate: true,
                              });
                            } else {
                              form.setValue("description", e.target.value, {
                                shouldValidate: false,
                              });
                            }
                          }}
                          maxLength={lengthLimit}
                          spellCheck="false"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria do ticket" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data?.categories.map((category) => (
                            <SelectItem value={category.name} key={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a prioridade do ticket" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data?.priorities.map((priority) => (
                            <SelectItem value={priority.name} key={priority.id}>
                              {priority.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isLoading ? (
                  <LoaderButton title="enviando ticket" />
                ) : (
                  <Button>Enviar</Button>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default page;
