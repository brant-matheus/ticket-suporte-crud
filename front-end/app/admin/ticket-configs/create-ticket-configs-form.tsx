import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { authInstance } from "@/app/axios-config";
import { useToastContext } from "@/components/utils/context-toast";

export interface HandleClickType {
  handleClick: Function;
}

interface FormType {
  item: string;
}

interface StateProps {
  title: string;
  fromTable: string;
}

export const CreateTicketConfigsForm = forwardRef((props, ref) => {
  const { ToastSuccess, ToastFail } = useToastContext();
  const [buttonBoolean, setButtonBoolean] = useState(false);
  const [open, setOpen] = useState(false);
  const [stateProps, setStateProps] = useState<StateProps>();
  useImperativeHandle(ref, () => ({
    handleClick({ title, fromTable }: StateProps) {
      setOpen(true);
      setStateProps({ title: title, fromTable: fromTable });
    },
  }));

  const { register, handleSubmit, resetField } = useForm<FormType>();

  async function StoreTicketConfig(ticketConfigSubmit: FormType) {
    setButtonBoolean(true);
    try {
      const { data, status, request } = await authInstance.post(
        "ticket-configs",
        ticketConfigSubmit,
        {
          params: {
            fromTable: stateProps?.fromTable,
          },
        }
      );
      if (status || request.status === 200) {
        ToastSuccess();
        setOpen(false);
      }
    } catch (error) {
      ToastFail({ description: "Nome em branco ou já existente" });
      setButtonBoolean(false);

      resetField("item");
    }
  }

  useEffect(() => {
    resetField("item");
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
              {...register("item")}
              placeholder="Digite nova configuração do ticket"
            ></Input>

            <Button disabled={buttonBoolean}>Criar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
});
