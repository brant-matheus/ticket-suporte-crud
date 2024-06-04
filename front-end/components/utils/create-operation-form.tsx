"use client";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

interface OperationProps {
  description: string;
}

export interface ModalProps {
  handleClick: Function;
}
interface TicketProps {
  ticketId?: number;
}
export const CreateTicketOperation = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ticketId, setTicketId] = useState<number | undefined>();
  useImperativeHandle(ref, () => ({
    handleClick({ ticketId }: TicketProps) {
      setIsOpen(true);
      setTicketId(ticketId);
    },
  }));
  const form = useForm<OperationProps>();
  async function storeDescription(description: OperationProps) {
    console.log(description);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <form
            onSubmit={form.handleSubmit(storeDescription)}
            className="grid gap-4"
          >
            <Label>Descrição da operação do ticket #{ticketId}</Label>
            <Input {...form.register("description")}></Input>
            <Button>Salvar operação</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
});
