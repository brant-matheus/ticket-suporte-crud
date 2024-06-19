import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
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
  handleCLick: ({
    ticketId,
    title,
    fromTable,
    isAdmin,
  }: {
    title: string;
    ticketId: number;
    fromTable: string;
    isAdmin: boolean;
  }) => void;
}

interface TicketProps {
  name: string;
  color: string;
  id: number;
}

interface DataProps {
  categories: TicketProps[];
  priorities: TicketProps[];
  statuses: TicketProps[];
}

export const EditTicketModal = forwardRef((props, ref) => {
  const [ticketId, setTicketId] = useState<number>();
  const [fromTable, setFromTable] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { ToastFail, ToastSuccess } = useToastContext();
  const [data, setData] = useState<DataProps | undefined>(undefined);
  async function getData() {
    setIsLoading(true);
    try {
      const { data } = await authInstance.get("ticket-configs", {
        params: { fromTable: fromTable },
      });
      setData(data);
    } catch (error) {}
  }
  useImperativeHandle(ref, () => ({
    handleCLick({
      title,
      ticketId,
      fromTable,
      isAdmin,
    }: {
      title: string;
      ticketId: number;
      fromTable: string;
      isAdmin: boolean;
    }) {
      setIsAdmin(isAdmin);
      setIsOpen(true);
      setTicketId(ticketId);
      setFromTable(fromTable);
      setTitle(title);
    },
  }));
  useEffect(() => {
    getData();
  }, [isOpen]);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <Tabs>
            <TabsList defaultValue="priority" className="grid w-96 grid-cols-2">
              <TabsTrigger value="priority">prioridade</TabsTrigger>
              <TabsTrigger value={fromTable}>{title}</TabsTrigger>
            </TabsList>
            <TabsContent value="priority">
              <Card>
                <CardContent>
                  <GenericEditTicketForm
                    action={() => setIsOpen(false)}
                    data={data?.priorities}
                    fromTable="priorities"
                    title="prioridade"
                    ticketId={ticketId}
                    key={ticketId}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value={fromTable}>
              <Card>
                <CardContent>
                  <GenericEditTicketForm
                    action={() => setIsOpen(false)}
                    data={isAdmin ? data?.statuses : data?.categories}
                    fromTable={fromTable}
                    title={title}
                    ticketId={ticketId}
                    key={ticketId}
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
