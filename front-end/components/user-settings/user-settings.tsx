import React from "react";
import { Separator } from "../ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserSettingsForm from "../forms/user-settings-form";
import UserDeleteButton from "../buttons/user-delete-button";
const UserSettings = () => {
  return (
    <div className="container flex justify-center ">
      <Card className="w-11/12">
        {/* header geral */}
        <CardHeader>
          <CardTitle>Redefina suas configurações pessoais.</CardTitle>
          <CardDescription>
            Você pode editar nome e email. Basta preencher os campos que devem
            ser alterados e deixar em brancos campos que devem ser mantidos
          </CardDescription>
        </CardHeader>
        {/* geral content */}
        <CardContent>
          <UserSettingsForm />
        </CardContent>
        {/* header password */}
        <Separator />
        <CardHeader>
          <CardTitle>Redefina sua senha</CardTitle>
          <CardDescription>
            Preencha sua nova senha e confirme a sua nova senha
          </CardDescription>
        </CardHeader>
        {/* password content */}
        <CardContent>
          <UserSettingsForm />
        </CardContent>
        <Separator />
        <CardHeader>
          <CardTitle>Deletar permanentemente sua conta</CardTitle>
          <CardDescription>
            Delete permanentemente sua conta, essa ação não pode ser desfeita,
            sua conta deixará de existir em nosso banco de dados.
          </CardDescription>
        </CardHeader>
        {/* delete content */}
        <CardContent>
          <UserDeleteButton />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
