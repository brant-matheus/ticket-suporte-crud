"use client";
import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import { CollapsibleDemo } from "./collapse-operation";
import { authInstance } from "@/app/axios-config";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, PlusCircle } from "lucide-react";
import { formatIso } from "@/components/utils/formatIso";
import Link from "next/link";
import ActionCreateButton from "@/components/buttons/action-create-button";
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
  isAdmin: number;
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
  finishedAt: number;
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
  async function getOperation() {
    const { data } = await authInstance.get("operation", {
      params: { ticketId: parseInt(params.ticketId) },
    });
    setData(data);
  }

  const ticket = data?.[0]?.ticket;
  const ticketProperties = [
    { title: "Assunto", item: ticket?.subject, key: 1 },
    { title: "Descrição", item: ticket?.description, key: 2 },
    { title: "Categoria", item: ticket?.ticketCategory.name, key: 3 },
    { title: "Prioridade", item: ticket?.ticketPriority.name, key: 4 },
    { title: "Status", item: ticket?.ticketStatus.name, key: 5 },
    { title: "Criado por email", item: ticket?.user.email, key: 6 },
    { title: "ID do usuário", item: ticket?.user.id, key: 7 },
    {
      title: "Concluido",
      item: ticket?.finishedAt ? formatIso(ticket.updatedAt) : "Não concluido",
      key: 8,
    },
  ];
  useEffect(() => {
    getOperation();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operações</CardTitle>
        <CardDescription>
          Visualize de forma detalhada operações criadas para o ticket ou crie
          uma nova operação.
        </CardDescription>
        <CardDescription>
          <Button variant="default" className="gap-1">
            <PlusCircle className="w-4 h-4" />{" "}
            <p className="text-sm">Criar nova operação</p>
          </Button>
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
                    <p className="">{value.item}</p>
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
