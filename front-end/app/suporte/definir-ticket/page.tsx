import React from "react";
import AdminSideBar from "@/components/layout/admin-side-bar";
import { DataTable } from "@/components/table/data-table";
import { categoriesColumns, TData } from "./categories-columns";
import { prioritiesColumns } from "./priorities-columns";
import { statusesColumns } from "./statuses-columns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const page = () => {
  return (
    <>
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
                columns={categoriesColumns}
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
