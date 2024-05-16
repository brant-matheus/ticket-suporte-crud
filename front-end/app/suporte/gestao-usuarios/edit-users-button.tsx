import React, { useState } from "react";
import { PencilLine } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralFormEdit from "./general-form-edit";
import { Button } from "@/components/ui/button";
import PasswordFormEdit from "@/components/forms/password-from-edit";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface props {
  fullName: string;
  email: string;
  isAdmin: number;
  userId: number;
}

const EditButton = ({ fullName, email, isAdmin, userId }: props) => {
  const [open, setOpen] = useState(false);
  function closeDialog() {
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <PencilLine className="h-5 w-5 text-green-600" />
      </DialogTrigger>

      <DialogContent>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">Informações editar</TabsTrigger>
            <TabsTrigger value="password">Redefinir senha</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <GeneralFormEdit
              fullName={fullName}
              email={email}
              isAdmin={isAdmin}
              userId={userId}
              closeDialog={closeDialog}
            />
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardContent>
                <PasswordFormEdit closeDialog={closeDialog} userId={userId} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditButton;
