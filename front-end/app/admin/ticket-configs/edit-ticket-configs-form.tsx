"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { authInstance } from "@/app/axios-config";

export interface ModalHandles {
  handleOpen: Function;
}
interface FormProps {
  item: string;
}

export const TicketConfigForm = forwardRef((props, ref) => {
  const [buttonBool, setButtonBool] = useState(false);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [title, setTitle] = useState("");
  const [params, setParams] = useState<number>();
  const [fromTable, setFromTable] = useState<string>();
  const handleOpen = () => {
    setOpen(true);
  };
  useImperativeHandle(ref, () => ({
    handleOpen(name: string, title: string, params: number, fromTable: string) {
      setItemName(name);
      setTitle(title);
      setParams(params);
      setFromTable(fromTable);
      handleOpen();
    },
  }));
  const form = useForm<FormProps>({ defaultValues: { item: "" } });
  async function editTicketConfig(item: FormProps) {
    setButtonBool(true);
    try {
      const { status } = await authInstance.put(
        `ticket-configs/${params}`,
        item,
        {
          params: {
            fromTable: fromTable,
          },
        }
        // toast sucess
      );
      setOpen(false);
    } catch (error) {
      setButtonBool(false);
      // toast fail
    }
  }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(editTicketConfig)}>
              <FormField
                control={form.control}
                name="item"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Editar {title}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Preencha para editar {title} "{itemName}"
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={buttonBool}>Salvar</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
});
