"use client";
import React, { useRef, useState } from "react";
import AdminSideBar from "@/components/layout/admin-side-bar";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ticketConfigsColumns, TData } from "./columns";
import CreateButton from "@/components/buttons/create-button";
import {
  CreateTicketConfigsForm,
  HandleClickType,
} from "./create-ticket-configs-form";
const page = () => {
  const formRef = useRef<HandleClickType>(null);
  return (
    <>
      <CreateTicketConfigsForm ref={formRef} />
      <AdminSideBar />
      <Tabs defaultValue="categories" className="w-11/12 mt-4 ml-20 space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="priorities">Prioridades</TabsTrigger>
          <TabsTrigger value="statuses">Status</TabsTrigger>
        </TabsList>
        <TabsContent value="categories">
          <Card>
            <CardContent>
              <DataTable
                columns={ticketConfigsColumns({
                  title: "categoria",
                  fromTableWhere: "ticket_category_id",
                  fromTable: "categories",
                })}
                component={
                  <CreateButton
                    action={() =>
                      formRef.current?.handleClick({
                        title: "categoria",
                        fromTable: "categories",
                      })
                    }
                    title="categoria"
                  />
                }
                filterColumn=""
                fromTable="categories"
                route="ticket-configs"
                showFilter={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="priorities">
          <Card>
            <CardContent>
              <DataTable
                columns={ticketConfigsColumns({
                  title: "prioridade",
                  fromTable: "priorities",
                  fromTableWhere: "ticket_priority_id",
                })}
                component={
                  <CreateButton
                    action={() =>
                      formRef.current?.handleClick({
                        title: "prioridade",
                        fromTable: "priorities",
                      })
                    }
                    title="prioridade"
                  />
                }
                filterColumn=""
                fromTable="priorities"
                route="ticket-configs"
                showFilter={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="statuses">
          <Card>
            <CardContent>
              <DataTable
                columns={ticketConfigsColumns({
                  title: "status",
                  fromTableWhere: "ticket_status_id",
                  fromTable: "statuses",
                })}
                component={
                  <CreateButton
                    action={() =>
                      formRef.current?.handleClick({
                        title: "status",
                        fromTable: "statuses",
                      })
                    }
                    title="status"
                  />
                }
                filterColumn=""
                fromTable="statuses"
                route="ticket-status"
                showFilter={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default page;
