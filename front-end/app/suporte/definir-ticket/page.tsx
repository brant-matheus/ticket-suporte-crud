"use client";
import React, { useRef, useState } from "react";
import AdminSideBar from "@/components/layout/admin-side-bar";
import { DataTable } from "@/components/table/data-table";
import { categoriesColumns, TData } from "./categories-columns";
import { prioritiesColumns } from "./priorities-columns";
import { statusesColumns } from "./statuses-columns";
import { ModalHandles, Child } from "@/components/utils/modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralFormEdit from "../users-managment/general-form-edit";
import { Button } from "@/components/ui/button";
const page = () => {
  const modalRef = useRef<ModalHandles>(null);

  return (
    <>
      <Child ref={modalRef} />
      <AdminSideBar onPage="set-ticket" />
      <Tabs defaultValue="categories" className="w-11/12 mt-4 ml-20 space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categoria</TabsTrigger>
          <TabsTrigger value="priorities">Prioridades</TabsTrigger>
          <TabsTrigger value="statuses">Status</TabsTrigger>
        </TabsList>
        <TabsContent value="categories">
          <Card>
            <CardContent>
              <DataTable
                columns={categoriesColumns(() =>
                  modalRef.current?.handleOpen("acerto")
                )}
                component={null}
                showFilter={false}
                filterColumn=""
                fromTable="categories"
                route="ticket-configs"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="priorities">
          <Card>
            <CardContent>
              <DataTable
                columns={prioritiesColumns}
                component={null}
                showFilter={false}
                filterColumn=""
                fromTable="priorities"
                route="ticket-configs"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="statuses">
          <Card>
            <CardContent>
              <DataTable
                columns={statusesColumns}
                component={null}
                showFilter={false}
                filterColumn=""
                fromTable="statuses"
                route="ticket-configs"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default page;
