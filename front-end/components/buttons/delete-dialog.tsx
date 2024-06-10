"use client";
import React from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { authInstance } from "@/app/axios-config";
import { useToast } from "@/components/ui/use-toast";

interface props {
  route: string;
  params: number;
  title: string;
  fromTableWhere: string;
}

const DeleteDialog = ({ route, params, title, fromTableWhere }: props) => {
  const { toast } = useToast();

  async function deleteUser() {
    try {
      await authInstance.delete(`${route}/${params}`, {
        params: {
          fromTableWhere: fromTableWhere,
        },
      });
      toast({
        variant: "sucess",
        title: `${title} deletado`,
        description: `${title} deletado permanentemente deletado.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `${title} não existe no nosso banco de dados.`,
      });
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Trash2 className="text-[red] h-5 w-5"></Trash2>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você tem certeza que deseja deletar {title} ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {title} será deletado permanentemente do nosso banco de dados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={deleteUser}
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
