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
import { useToastContext } from "@/components/utils/context-toast";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
export interface ModalHandles {
  handleClick: (props: HandleProps) => void;
}
interface FormProps {
  name: string;
  color: string;
}

interface HandleProps {
  ticketConfigName: string;
  title: string;
  params: number;
  route: string;
}

interface Colors {
  id: number;
  name: string;
  hex: string;
}

export const TicketConfigForm = forwardRef((props, ref) => {
  const { ToastSuccess, ToastFail } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const [stateProps, setStateProps] = useState<HandleProps>();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const [colors, SetColors] = useState<Colors[]>([]);

  async function getColors() {
    setIsLoading(true);
    try {
      const { status, request, data } = await authInstance.get("color");
      if ((status ?? request.status) == 200) {
        SetColors(data);
        setIsLoading(false);
      }
    } catch (error) {}
  }
  useImperativeHandle(ref, () => ({
    handleClick(props: HandleProps) {
      handleOpen();
      setStateProps(props);
      getColors();
    },
  }));
  const form = useForm<FormProps>();
  async function editTicketConfig(item: FormProps) {
    setIsLoading(true);
    try {
      const { status } = await authInstance.put(
        `${stateProps?.route}/${stateProps?.params}`,
        item
      );

      ToastSuccess();

      setOpen(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      ToastFail({
        description: `${stateProps?.title} usado em ticket.`,
      });
    }
  }

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
                name="name"
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
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cores</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma cor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem value={color.name} key={color.id}>
                            {color.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {isLoading ? (
                <LoaderButton title="carregando..." />
              ) : (
                <Button>Salvar</Button>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
});
