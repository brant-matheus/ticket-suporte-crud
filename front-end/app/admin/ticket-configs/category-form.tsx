"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { forwardRef, useImperativeHandle, useState } from "react";

export interface ModalHandles {
  handleOpen: Function;
}

export const CategoryForm = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  useImperativeHandle(ref, () => ({
    handleOpen() {
      handleOpen();
    },
  }));
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent></DialogContent>
      </Dialog>
    </>
  );
});
