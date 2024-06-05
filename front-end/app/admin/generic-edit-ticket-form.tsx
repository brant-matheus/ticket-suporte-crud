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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DataProps {
  name: string;
  id: number;
}
interface FormProps {
  data: any[];
  title: string;
}
export function GenericEditTicketForm({ data, title }: FormProps) {
  const FormSchema = z.object({
    ticketConfigItem: z.string().min(1, { message: "Selecione uma categoria" }),
    description: z.string().min(25, {
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
    console.log(form);
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
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Digite uma descrição" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button>Salvar</Button>
        </form>
      </Form>
    </>
  );
}
