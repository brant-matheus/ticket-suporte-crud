"use client";
import React, { useRef, useState } from "react";
import AdminSideBar from "@/components/layout/admin-side-bar";
import { DataTable } from "@/components/table/data-table";
// import { categoriesColumns, TData } from "./categories-columns";
import { ModalHandles, Child } from "@/components/utils/modal";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ticketConfigsColumns, TData } from "./columns";
const page = () => {
  const modalRef = useRef<ModalHandles>(null);

  return (
    <>
      <Child ref={modalRef} />
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
                })}
                component={null}
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
                  fromTableWhere: "ticket_priority_id",
                })}
                component={null}
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
                })}
                component={null}
                filterColumn=""
                fromTable="statuses"
                route="ticket-configs"
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
