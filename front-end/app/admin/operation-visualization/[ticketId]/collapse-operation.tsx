"use client";

import { ChevronsUpDown, Key, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DateTime } from "luxon";
import { title } from "process";
interface User {
  id: number;
  fullName: string;
  email: string;
  isAdmin: number;
  createdAt: string;
  updatedAt: string;
}

interface Operation {
  id: number;
  description: string;
  responsibleId: number;
  ticketId: number;
  createdAt: string;
  updatedAt: string;
  responsible: User;
}

export function CollapsibleDemo(operation: Operation) {
  const operationsTitles = [
    {
      title: "Email do responsável",
      item: operation.responsible.email,
      key: 1,
    },
    { title: "ID do responsável", item: operation.responsible.id, key: 2 },
    { title: "Descrição", item: operation.description, key: 3 },
    { title: "Craido em", item: formatIso(operation.createdAt), key: 4 },
    {
      title: "Editado em",
      item:
        operation.createdAt === operation.updatedAt ? (
          <p>Não editado</p>
        ) : (
          formatIso(operation.updatedAt)
        ),
      key: 5,
    },
  ];
  const [isOpen, setIsOpen] = useState(false);
  function formatIso(iso: string) {
    return DateTime.fromISO(iso, { locale: "pt-BR" }).toLocaleString(
      DateTime.DATETIME_FULL_WITH_SECONDS
    );
  }

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center">
          <CollapsibleTrigger asChild>
            <Button variant="link" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <h4 className="text-sm font-semibold">
            Operação id #{operation.id} do ticket id #{operation.ticketId}.
          </h4>
          {/* email, id, descrição, criado em, editado em */}
        </div>

        <CollapsibleContent>
          <Card className="w-full">
            <CardContent className="pt-1">
              <div className="grid gap-y-1 ">
                {operationsTitles.map((value) => (
                  <>
                    {" "}
                    <div className="flex flex-wrap gap-x-1">
                      <p className="text-cyan-500">{value.title}:</p>
                      <p>{value.item}</p>
                    </div>
                  </>
                ))}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
