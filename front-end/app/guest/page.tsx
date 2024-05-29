"use client";
import React from "react";
import { columns } from "./columns";
import { GuestNavBar } from "@/components/layout/guest-side-bar";
import { DataTable } from "@/components/table/data-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const page = () => {
  const router = useRouter();
  return (
    <>
      <GuestNavBar />
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
    </>
  );
};

export default page;
