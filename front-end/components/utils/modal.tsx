"use client";
import RegisterModal from "../forms/register-modal";
import { Dialog, DialogContent } from "../ui/dialog";
import React, { forwardRef, useImperativeHandle, useState } from "react";

export interface ModalHandles {
  handleOpen: Function;
}

export const Child = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handlesClose = () => {
    setOpen(false);
  };
  useImperativeHandle(ref, () => ({
    handleOpen() {
      handleOpen();
    },
  }));
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <RegisterModal closeDialog={handlesClose} />
        </DialogContent>
      </Dialog>
    </>
  );
});
