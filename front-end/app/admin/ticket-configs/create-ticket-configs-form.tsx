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
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { TicketConfigValidator, TicketConfigInfer } from "@/app/zod-validator";
import { zodResolver } from "@hookform/resolvers/zod";

export interface HandleClickType {
  handleClick: ({ route, title }: StateProps) => void;
}

interface FormType {
  name: string;
  color: string;
}

interface StateProps {
  title: string;
  route: string;
}

interface Colors {
  id: number;
  name: string;
  hex: string;
}

export const CreateTicketConfigsForm = forwardRef((props, ref) => {
  const { ToastSuccess, ToastFail } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [stateProps, setStateProps] = useState<StateProps>();

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
    handleClick({ title, route }: StateProps) {
      setOpen(true);
      setStateProps({ title: title, route: route });
      getColors();
    },
  }));

  const form = useForm<TicketConfigInfer>({
    resolver: zodResolver(TicketConfigValidator),
    defaultValues: {
      color: "",
      name: "",
    },
  });
  async function StoreTicketConfig(ticketConfigSubmit: TicketConfigInfer) {
    setIsLoading(true);
    try {
      const { data, status, request } = await authInstance.post(
        `${stateProps?.route}`,
        ticketConfigSubmit
      );
      if ((status ?? request.status) == 201) {
        ToastSuccess();
        setOpen(false);
      }
    } catch (error) {
      ToastFail({ description: `${stateProps?.title}  existente.` });
      setIsLoading(false);
    }
  }
  useEffect(() => {
    form.reset();
  }, [open, form]);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <Form {...form}>
            <form
              className="grid gap-4"
              onSubmit={form.handleSubmit(StoreTicketConfig)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do status" />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isLoading ? (
                <LoaderButton title="carregando.." />
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

CreateTicketConfigsForm.displayName = "create ticket configuration form";
