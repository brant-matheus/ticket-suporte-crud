"use client";

import React, { useRef } from "react";
import AdminSideBar from "@/components/layout/admin-side-bar";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import {} from "./columns";
import { CreateTicketOperation, ModalHandles } from "./create-operation-form";
import { ShowTicketModal, ShowTicketModalHandles } from "./show-ticket-modal";
import { EditTicketModal, ModalEditProps } from "./edit-ticket";

const Page = () => {
  const createTicketOperationModalRef = useRef<ModalHandles>();
  const showTicketModalRef = useRef<ShowTicketModalHandles>();
  const EditTicketModalRef = useRef<ModalEditProps>();

  return (
    <>
      <AdminSideBar />
      <div className="container pt-0 pl-20 pb-5">
        <CreateTicketOperation ref={createTicketOperationModalRef} />
        <ShowTicketModal
          modalRefCreateOperation={createTicketOperationModalRef}
          ref={showTicketModalRef}
        />
        <EditTicketModal ref={EditTicketModalRef} />
        <DataTable
          showFilter={true}
          route="ticket"
          columns={columns(
            createTicketOperationModalRef,
            showTicketModalRef,
            EditTicketModalRef
          )}
          filterColumn="criado por"
        />
      </div>
    </>
  );
};

export default Page;
