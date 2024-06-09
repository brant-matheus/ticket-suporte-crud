import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { authInstance } from "@/app/axios-config";
import { useToastContext } from "@/components/utils/context-toast";
import LoaderButton from "@/components/buttons/loader-button";
import { useState } from "react";

interface DataProps {
  name: string;
  id: number;
}
interface FormProps {
  data: any[] | undefined;
  title: string;
  ticketId?: number;
  fromTable: string;
  action: Function;
}
export function GenericEditTicketForm({
  data,
  title,
  ticketId,
  fromTable,
  action,
}: FormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { ToastFail, ToastSuccess } = useToastContext();
  const FormSchema = z.object({
    ticketConfigItem: z.string().min(1, { message: "Selecione uma categoria" }),
    description: z.string().min(1, {
      message: "Escreva uma descrição de pelo menos 25 caracteres.",
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
      ticketConfigItem: "",
    },
  });
  async function editTicket(form: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const { data } = await authInstance.put(`/ticket/${ticketId}`, form, {
        params: { fromTable: fromTable },
      });
      action();
      ToastSuccess();
    } catch (error) {
      setIsLoading(false);
      ToastFail({ description: `error ao editar ${title}` });
    }
  }
  return (
    <>
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(editTicket)}>
          <FormField
            control={form.control}
            name="ticketConfigItem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{title}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Selecione ${title}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data?.map((value: DataProps) => (
                      <SelectItem value={value.name} key={value.id}>
                        {value.name}
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição </FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Digite uma descrição" />
                </FormControl>

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
    </>
  );
}
