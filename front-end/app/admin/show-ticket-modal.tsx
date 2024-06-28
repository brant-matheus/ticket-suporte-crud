"use client";
import {
  forwardRef,
  MutableRefObject,
  useImperativeHandle,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import { useToastContext } from "../../components/utils/context-toast";
import { MessagesSquare } from "lucide-react";
import { Ticket } from "./columns";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ModalHandles } from "./create-operation-form";

interface ShowTicketModalProps {
  modalRefCreateOperation: MutableRefObject<ModalHandles | undefined>;
}

export interface ShowTicketModalHandles {
  handleClick: Function;
  setTicket: (ticket: Ticket) => void;
}

interface TicketProps {
  ticketId?: number;
}

export const ShowTicketModal = forwardRef(
  ({ modalRefCreateOperation }: ShowTicketModalProps, ref) => {
    const { ToastFail, ToastSuccess } = useToastContext();
    const [isOpen, setIsOpen] = useState(false);
    const [ticket, setTicket] = useState<Ticket>();

    useImperativeHandle(ref, () => ({
      handleClick() {
        setIsOpen(true);
      },
      setTicket(ticket: Ticket) {
        setTicket(ticket);
      },
    }));

    return (
      <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost">
              <MessagesSquare className="h-5 w-5 cursor-pointer" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            {ticket && (
              <>
                <div className="flex flex-col space-y-4">
                  <div className="">
                    <p className="text-cyan-500">Assunto do ticket:</p>{" "}
                    <p>{ticket.subject}</p>
                  </div>
                  <div className="">
                    <p className="text-cyan-500">Descrição do ticket:</p>{" "}
                    <p>{ticket.description}</p>
                  </div>
                </div>
                <Separator />
                Create operation ticket
                {ticket.ticketStatus.name === "pendente" ? (
                  "Nenhuma operação criada"
                ) : (
                  <div className="flex justify-center">
                    <Button
                      variant="link"
                      onClick={() =>
                        window.open(
                          `/admin/operation-visualization/${ticket.id}`,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      Visualizar operações
                    </Button>
                  </div>
                )}
                <div className="flex justify-center">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      modalRefCreateOperation.current?.handleClick({
                        ticketId: ticket.id,
                      });
                    }}
                  >
                    Cadastrar nova operação
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

ShowTicketModal.displayName = "ShowTicketModal";
