"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { authInstance } from "@/app/axios-config";
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
                  route: "ticket-category",
                })}
                component={
                  <CreateButton
                    action={() =>
                      formRef.current?.handleClick({
                        title: "categoria",
                        route: "ticket-category",
                      })
                    }
                    title="categoria"
                  />
                }
                route="ticket-category"
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
                  route: "ticket-priority",
                })}
                component={
                  <CreateButton
                    action={() =>
                      formRef.current?.handleClick({
                        title: "prioridade",
                        route: "ticket-priority",
                      })
                    }
                    title="prioridade"
                  />
                }
                showFilter={false}
                route="ticket-priority"
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
                  route: "ticket-status",
                })}
                component={
                  <CreateButton
                    action={() =>
                      formRef.current?.handleClick({
                        title: "status",
                        route: "ticket-status",
                      })
                    }
                    title="status"
                  />
                }
                showFilter={false}
                route="ticket-status"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default page;
