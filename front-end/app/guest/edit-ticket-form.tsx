"use client";

import { authInstance } from "@/app/axios-config";
import LoaderButton from "@/components/buttons/loader-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { StoreTicketInfer, StoreTicketValidation } from "../zod-validator";

interface TicketConfigProps {
  id: number;
  name: string;
}

interface TicketProps {
  ticketId: number;
  ticketSubject: string;
  ticketDescription: string;
  ticketCategory: string;
  ticketPriority: string;
}

export interface EditTicketModalHandles {
  handleClick: () => void;
  setTicketProps: (item: TicketProps) => void;
}

export const EditTicketForm = forwardRef((props, ref) => {
  const [priorities, setPriorities] = useState<TicketConfigProps[]>([]);
  const [categories, setCategories] = useState<TicketConfigProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<TicketProps | null>(null);
  const [character, setCharacter] = useState<number>();

  useImperativeHandle(ref, () => ({
    handleClick() {
      setIsOpen(true);
    },

    setTicketProps(item: TicketProps) {
      setItem(item);
    },
  }));

  const form = useForm<StoreTicketInfer>({
    resolver: zodResolver(StoreTicketValidation),
    // defaultValues: {
    //   category: item?.ticketCategory,
    //   description: item?.ticketDescription,
    //   priority: item?.ticketPriority,
    //   subject: item?.ticketSubject,
    // },
  });

  async function updateTicket(ticket: StoreTicketInfer) {
    console.log(ticket);
    setIsOpen(false);
  }

  useEffect(() => {
    async function getCategories() {
      try {
        const { data } = await authInstance.get("ticket-category");
        setCategories(data);
      } catch (error) {}
    }

    async function getPriorities() {
      try {
        const { data } = await authInstance.get("ticket-priority");
        setPriorities(data);
      } catch (error) {}
    }
    getCategories();
    getPriorities();
    if (item) {
      setCharacter(item.ticketDescription.length);
      form.reset({
        category: item.ticketCategory,
        description: item.ticketDescription,
        priority: item.ticketPriority,
        subject: item.ticketSubject,
      });
    }
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(updateTicket)}
              className="grid gap-4"
            >
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>assunto</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                      <p>Caracteres usados: {character} limite: 500</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        onChange={(e) => {
                          setCharacter(e.target.value.length);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
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
                          <SelectValue placeholder={item?.ticketCategory} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category: any) => (
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
                          <SelectValue placeholder={item?.ticketPriority} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorities?.map((priority) => (
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
        </DialogContent>
      </Dialog>
    </>
  );
});

EditTicketForm.displayName = "EditTicketForm";
