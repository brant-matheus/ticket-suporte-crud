import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { authInstance } from "@/app/axios-config";
import { useToastContext } from "@/components/utils/context-toast";
import { Select } from "@/components/ui/select";

export interface HandleClickType {
  handleClick: ({ route, title }: StateProps) => void;
}

interface FormType {
  name: string;
  color: string;
}

interface StateProps {
  title: string;
  route: string;
}

export const CreateTicketConfigsForm = forwardRef((props, ref) => {
  const { ToastSuccess, ToastFail } = useToastContext();
  const [buttonBoolean, setButtonBoolean] = useState(false);
  const [open, setOpen] = useState(false);
  const [stateProps, setStateProps] = useState<StateProps>();
  useImperativeHandle(ref, () => ({
    handleClick({ title, route }: StateProps) {
      setOpen(true);
      setStateProps({ title: title, route: route });
    },
  }));

  const { register, handleSubmit, resetField } = useForm<FormType>();

  async function StoreTicketConfig(ticketConfigSubmit: FormType) {
    setButtonBoolean(true);
    try {
      const { data, status, request } = await authInstance.post(
        `${stateProps?.route}`,
        ticketConfigSubmit
      );
      if ((status ?? request.status) == 201) {
        ToastSuccess();
        setOpen(false);
      }
    } catch (error) {
      ToastFail({ description: "Nome em branco ou já existente" });
      setButtonBoolean(false);

      resetField("name");
    }
  }

  useEffect(() => {
    resetField("name");
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form
            onSubmit={handleSubmit(StoreTicketConfig)}
            className="grid gap-4"
          >
            <Label>{stateProps?.title}</Label>
            <Input
              {...register("name")}
              placeholder="Digite nova configuração do ticket"
            ></Input>
            <Label>Cor</Label>
            <Select></Select>
            <Button disabled={buttonBoolean}>Criar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
});
