"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  Form,
  FormMessage,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { StoreTicketValidation, StoreTicketInfer } from "../zod-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoaderButton from "@/components/buttons/loader-button";
import { Button } from "@/components/ui/button";
import { authInstance } from "../axios-config";
import { Textarea } from "@/components/ui/textarea";

interface TicketConfigSelect {
  name: string;
  id: number;
}

interface TicketProps {
  subject: string;
  description: string;
}

export interface ModalEditTicketProps {
  handleClick: (item: TicketProps) => void;
}

export const EditTicketForm = forwardRef((props, ref) => {
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

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<TicketConfigSelect[]>();
  const [priorities, setPriorities] = useState<TicketConfigSelect[]>();
  const [ticketProps, setTicketProps] = useState<TicketProps>();
  useImperativeHandle(ref, () => ({
    handleCLick(item: TicketProps) {
      setIsOpen(true);
      setTicketProps(item);
      getCategories();
      getPriorities();
    },
  }));

  const form = useForm<StoreTicketInfer>({
    resolver: zodResolver(StoreTicketValidation),
  });

  async function editTicket(ticket: StoreTicketInfer) {}
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(editTicket)}>
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
                    Descrição <p>Caracteres usados: limite: 500</p>
                  </FormLabel>
                  <FormControl>
                    <Textarea maxLength={1} spellCheck="false" />
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
                      {categories?.map((category) => (
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
              <LoaderButton title="carregando" />
            ) : (
              <Button>Enviar</Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
