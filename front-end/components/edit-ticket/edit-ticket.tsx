import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useToastContext } from "@/components/utils/context-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { authInstance } from "@/app/axios-config";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GenericEditTicketForm } from "./generic-edit-ticket-form";

export interface ModalEditProps {
  handleCLick: () => void;
}

interface TicketProps {
  name: string;
  color: string;
  id: number;
}

interface DataProps {
  categories: TicketProps[];
  priorities: TicketProps[];
}

export const EditTicketGuest = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { ToastFail, ToastSuccess } = useToastContext();
  const [data, setData] = useState<DataProps>();
  async function getData() {
    setIsLoading(true);
    try {
      const { data } = await authInstance.get("ticket-configs");
      setData(data);
    } catch (error) {}
  }
  useImperativeHandle(ref, () => ({
    handleCLick() {
      setIsOpen(true);
      getData();
    },
  }));
  const title = "teste";
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <Tabs>
            <TabsList defaultValue="priority">
              <TabsTrigger value="priority">prioridade</TabsTrigger>
              <TabsTrigger value="category">categoria</TabsTrigger>
            </TabsList>
            <TabsContent value="priority">
              <Card>
                <CardContent>
                  <GenericEditTicketForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="category">
              <Card>
                <CardContent></CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
});
