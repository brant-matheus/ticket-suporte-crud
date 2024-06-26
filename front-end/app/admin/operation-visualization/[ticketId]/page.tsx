"use client";
import { useState, useEffect, useRef } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import { CollapsibleDemo } from "./collapse-operation";
import { authInstance } from "@/app/axios-config";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, PlusCircle } from "lucide-react";
import { formatIso } from "@/components/utils/formatIso";

import CreateButton from "@/components/buttons/create-button";
import {
  CreateTicketOperation,
  ModalHandles,
} from "../../create-operation-form";

interface TicketConfig {
  id: number;
  name: string;
  color: string;
  responsibleId: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  isAdmin: boolean;
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

interface Operation {
  id: number;
  description: string;
  responsibleId: number;
  ticketId: number;
  createdAt: string;
  updatedAt: string;
  responsible: User;
  ticket: Ticket;
}
export default function Page() {
  const params = useParams<{ ticketId: string }>();

  const [data, setData] = useState<Operation[] | undefined>([]);

  const [ticket, setTicket] = useState<Ticket>();

  console.log(ticket);

  const ticketProperties = [
    { title: "Assunto", item: ticket?.subject, key: 1 },
    { title: "Descrição", item: ticket?.description, key: 2 },
    { title: "Categoria", item: ticket?.ticketCategory?.name, key: 3 },
    { title: "Prioridade", item: ticket?.ticketPriority.name, key: 4 },
    { title: "Status", item: ticket?.ticketStatus.name, key: 5 },
    { title: "Criado por email", item: ticket?.user.email, key: 6 },
    { title: "ID do usuário", item: ticket?.user.id, key: 7 },
    {
      title: "Concluido",
      item: ticket?.isConclued ? formatIso(ticket.updatedAt) : "Não concluido",
      key: 8,
    },
  ];

  const createTicketOperationModalRef = useRef<ModalHandles>();

  useEffect(() => {
    async function getTicket() {
      const { data } = await authInstance.get(`ticket/${params.ticketId}`, {
        params: { ticketId: parseInt(params.ticketId) },
      });
      setTicket(data);
    }

    async function getOperation() {
      const { data } = await authInstance.get("operation", {
        params: { ticketId: parseInt(params.ticketId) },
      });
      setData(data);
    }

    getTicket();
    getOperation();
  }, [params]);

  return (
    <Card>
      <CreateTicketOperation ref={createTicketOperationModalRef} />

      <CardHeader>
        <CardTitle>Operações</CardTitle>
        <CardDescription>
          Visualize de forma detalhada operações criadas para o ticket ou crie
          uma nova operação.
        </CardDescription>
        <CardDescription>
          <CreateButton
            action={() =>
              createTicketOperationModalRef.current?.handleClick({
                ticketId: params.ticketId,
              })
            }
            title="operação"
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible>
          <div className="flex items-center">
            <CollapsibleTrigger asChild>
              <Button variant="link" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <h4 className="text-sm font-semibold">
              Informações do ticket #{params.ticketId}
            </h4>{" "}
          </div>
          <CollapsibleContent>
            <Card className="w-full">
              <CardContent>
                {ticketProperties.map((value) => (
                  <div className="flex flex-wrap gap-x-1" key={value.key}>
                    <p className="text-cyan-500">{value.title}:</p>
                    {value.item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {data?.map((value) => (
          <CollapsibleDemo
            id={value.id}
            createdAt={value.createdAt}
            description={value.description}
            responsible={value.responsible}
            responsibleId={value.id}
            ticketId={value.ticketId}
            updatedAt={value.updatedAt}
            key={value.id}
          />
        ))}
      </CardContent>
    </Card>
  );
}
