import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { authInstance } from "../axios-config";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GenericEditTicketForm } from "./generic-edit-ticket-form";

interface DataProps {
  id: number;
  name: string;
  color: string;
}

export interface EditModalProps {
  handleClick: Function;
}
export const EditTicketForm = forwardRef((props, ref) => {
  const [status, setStatus] = useState<any[]>([]);
  const [priority, setPriority] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  async function getData() {
    const status = await authInstance.get("ticket-configs", {
      params: { fromTable: "statuses", page: 1, pageSize: 10 },
    });
    const priorities = await authInstance.get("ticket-configs", {
      params: { fromTable: "priorities", page: 1, pageSize: 10 },
    });
    const statusData = status.data.data;
    const prioritiesData = priorities.data.data;
    setStatus(statusData.filter((item: DataProps) => item.name !== "pendente"));
    setPriority(prioritiesData);
  }

  useImperativeHandle(ref, () => ({
    handleClick() {
      setIsOpen(true);
      getData();
    },
  }));
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
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <Tabs defaultValue="priority">
            <TabsList>
              <TabsTrigger value="priority">Alterar prioridade</TabsTrigger>
              <TabsTrigger value="status">Alterar status</TabsTrigger>
            </TabsList>
            <TabsContent value="priority">
              <Card>
                <CardContent>
                  <GenericEditTicketForm data={priority} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="status">
              <Card>
                <CardContent>
                  <GenericEditTicketForm data={status} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
});
