"use client";
import CreateButton from "@/components/buttons/create-button";
import { GuestNavBar } from "@/components/layout/guest-side-bar";
import { DataTable } from "@/components/table/data-table";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { EditTicketModalHandles, EditTicketForm } from "./edit-ticket-form";
import { useRef } from "react";
const Page = () => {
  const router = useRouter();
  const editTicketModalRef = useRef<EditTicketModalHandles>();
  return (
    <>
      <GuestNavBar />
      <EditTicketForm ref={editTicketModalRef} />
      <div className="container pt-0 pl-20 pb-5 ">
        <DataTable
          columns={columns({ EditTicketModalHandles: editTicketModalRef })}
          route="ticket"
          component={
            <CreateButton
              action={() => router.push("/guest/send-ticket")}
              title="novo ticket"
            />
          }
          showFilter={false}
        />
      </div>
    </>
  );
};

export default Page;
