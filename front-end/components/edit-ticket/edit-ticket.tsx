import { authInstance } from "@/app/axios-config";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToastContext } from "@/components/utils/context-toast";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { GenericEditTicketForm } from "./generic-edit-ticket-form";

interface Color {
  name: string;
  hex: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TicketConfig {
  id: number;
  name: string;
  color: Color;
  responsibleId: number;
  createdAt: string;
  updatedAt: string;
}
interface Ticket {
  id: number;
  createdById: number;
  subject: string;
  description: string;
  ticketCategoryId: number;
  ticketPriorityId: number;
  ticketStatusId: number;
  createdAt: string;
  updatedAt: string;
  isConclued: boolean;
  user: User;
  ticketCategory: TicketConfig;
  ticketPriority: TicketConfig;
  ticketStatus: TicketConfig;
}
interface ParamsProps {
  item: Ticket;
  title: string;
  tabs: "priority" | "category";
}
export interface ModalEditProps {
  handleCLick: ({ item, title }: ParamsProps) => void;
}

interface TicketProps {
  name: string;
  color: string;
  id: number;
}

export const EditTicketModal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<Ticket>();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState();
  const [category, setCategory] = useState();

  useImperativeHandle(ref, () => ({
    handleCLick({ item, title }: ParamsProps) {
      setIsOpen(true);
      setItem(item);
      setTitle(title);
    },
  }));

  async function getPriority() {
    try {
      const { data } = await authInstance.get("ticket-priority");
      setPriority(data.data);
    } catch (error) {}
  }

  async function getCategory() {
    try {
      const { data } = await authInstance.get("ticket-category");
      setCategory(data.data);
    } catch (error) {}
  }
  useEffect(() => {
    getCategory();
    getPriority();
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <Tabs>
            <TabsList defaultValue="priority" className="grid w-96 grid-cols-2">
              <TabsTrigger value="priority">prioridade</TabsTrigger>
              <TabsTrigger value="status">{title}</TabsTrigger>
            </TabsList>
            <TabsContent value="priority">
              <Card>
                <CardContent>
                  <GenericEditTicketForm
                    action={() => setIsOpen(false)}
                    data={priority}
                    fromTable="priority"
                    title="prioridade"
                    ticketId={item?.id}
                    key={item?.id}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="status">
              <Card>
                <CardContent>
                  <GenericEditTicketForm
                    action={() => setIsOpen(false)}
                    data={category}
                    fromTable={"status"}
                    title={title}
                    ticketId={item?.id}
                    key={item?.id}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
});
