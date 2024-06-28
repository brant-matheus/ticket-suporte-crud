"use client";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { authInstance } from "@/app/axios-config";
import { useToastContext } from "../../components/utils/context-toast";
import { Textarea } from "../../components/ui/textarea";
import LoaderButton from "@/components/buttons/loader-button";

interface OperationProps {
  description: string;
}

export interface ModalHandles {
  handleClick: Function;
}
interface TicketProps {
  ticketId?: number;
}
export const CreateTicketOperation = forwardRef((props, ref) => {
  const { ToastFail, ToastSuccess } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    const data = Object.assign(description, { ticketId: ticketId });
    try {
      const { status, request } = await authInstance.post("operation", data);
      setIsOpen(false);
      ToastSuccess();
    } catch (error) {
      ToastFail({ description: "Error criar operação" });
      setIsLoading(false);
    }
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
            {/* <Input {...form.register("description")}></Input> */}
            <Textarea
              {...form.register("description")}
              placeholder="Digite uma descrição"
              spellCheck={false}
            />
            {isLoading ? (
              <LoaderButton title={"Criando Operação"} />
            ) : (
              <Button>Criar operação</Button>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
});

CreateTicketOperation.displayName = "Create operation ticket";
