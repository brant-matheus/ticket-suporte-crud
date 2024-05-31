"use client";
import { forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";

interface OperationProps {
  description: string;
}

export const CreateTicketOperation = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({ handleClick() {} }));
  const form = useForm<OperationProps>();
  async function storeDescription(description: OperationProps) {
    console.log(description);
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(storeDescription)}>
        <Label>Descrição</Label>
        <Input {...form.register("description")}></Input>
        <FormDescription>Descrição interna do sistema</FormDescription>
        <Button>Salvar descrição</Button>
      </form>
    </>
  );
});
