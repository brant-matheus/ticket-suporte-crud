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
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { authInstance } from "@/app/axios-config";
import { useToastContext } from "@/components/utils/context-toast";

export interface ModalHandles {
  handleClick: (props: HandleProps) => void;
}
interface FormProps {
  item: string;
}

interface HandleProps {
  ticketConfigName: string;
  title: string;
  params: number;
  fromTable: string;
}

export const TicketConfigForm = forwardRef((props, ref) => {
  const [editStatusBool, setEditStatusBool] = useState(false);
  const { ToastSuccess, ToastFail } = useToastContext();
  const [buttonBool, setButtonBool] = useState(false);
  const [stateProps, setStateProps] = useState<HandleProps>();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  useImperativeHandle(ref, () => ({
    handleClick(props: HandleProps) {
      handleOpen();
      setStateProps(props);
    },
  }));
  const form = useForm<FormProps>();
  async function editTicketConfig(item: FormProps) {
    setButtonBool(true);
    try {
      const { status } = await authInstance.put(
        `ticket-configs/${stateProps?.params}`,
        item,
        {
          params: {
            fromTable: stateProps?.fromTable,
          },
        }
      );

      ToastSuccess();

      setOpen(false);
    } catch (error) {
      setButtonBool(false);
      ToastFail({
        description: "Nome em branco ou nome já existente.",
      });
    }
  }
  useEffect(() => {
    form.reset();
  }, [open]);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(editTicketConfig)}
              className="grid gap-4"
            >
              <FormField
                defaultValue={stateProps?.ticketConfigName}
                control={form.control}
                name="item"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Editar {stateProps?.title}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Digite novo nome..." />
                    </FormControl>

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
