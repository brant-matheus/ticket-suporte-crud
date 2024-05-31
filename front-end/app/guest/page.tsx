"use client";
import React from "react";
import { columns } from "./columns";
import { GuestNavBar } from "@/components/layout/guest-side-bar";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const page = () => {
  const router = useRouter();
  return (
    <>
      <GuestNavBar />
      <div className="container pt-0 pl-20 pb-5 ">
        <DataTable
          columns={columns}
          route="ticket"
          component={
            <Button onClick={() => router.push("/guest/send-ticket")}>
              Criar novo ticket
            </Button>
          }
          showFilter={true}
          filterColumn="id"
          fromTable=""
        />
      </div>
    </>
  );
};

export default page;
