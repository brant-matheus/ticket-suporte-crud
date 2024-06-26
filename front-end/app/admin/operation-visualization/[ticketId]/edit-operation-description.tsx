"use client";
import { authInstance } from "@/app/axios-config";
import LoaderButton from "@/components/buttons/loader-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToastContext } from "@/components/utils/context-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
interface DescriptionProps {
  commentId: number;
  description: string;
}

interface DescriptionFormProps {
  description: string;
}
export default function DescriptionForm({
  commentId,
  description,
}: DescriptionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { ToastFail, ToastSuccess } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<DescriptionFormProps>();
  async function editDescription(descriptionForm: DescriptionFormProps) {
    setIsLoading(true);
    try {
      const { status, request } = await authInstance.put(
        `/operation/${commentId}`,
        descriptionForm
      );
      if ((status ?? request.status) === 200) {
        setIsOpen(false);
        ToastSuccess();
      }
    } catch (error) {
      form.reset();
      ToastFail({ description: "Error ao editar descrição de operação" });
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-primary underline-offset-4 hover:underline">
          editar descrição
        </button>
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={form.handleSubmit(editDescription)}
          className="grid gap-4"
        >
          <Label>Descrição</Label>
          <Textarea {...form.register("description", { value: description })} />
          {isLoading ? (
            <LoaderButton title="salvando alteração" />
          ) : (
            <Button>Salvar</Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
