"use client";
import React from "react";
import { Separator } from "../ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GeneralUserForm from "./general-user-settings-form";
import UserDeleteButton from "../buttons/user-delete-button";
import PasswordFormEdit from "../forms/password-from-edit";

const UserSettings = () => {
  return (
    <div className="container flex justify-center ">
      <Card className="w-11/12 ">
        <CardHeader>
          <CardTitle>Configuração de usuário</CardTitle>
          <CardDescription>
            Altere informações gerais, redefina sua senha e delete sua conta
            aqui.
          </CardDescription>
        </CardHeader>
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
          {/* form */}
          <GeneralUserForm />
        </CardContent>
        <Separator />

        {/* header password */}
        <CardHeader>
          <CardTitle>Redefina sua senha</CardTitle>
          <CardDescription>
            Preencha sua nova senha e confirme a sua nova senha
          </CardDescription>
        </CardHeader>
        {/* password content */}
        <CardContent>
          <PasswordFormEdit />
        </CardContent>
        <Separator />

        {/* delete user header*/}
        <CardHeader>
          <CardTitle>Deletar permanentemente sua conta</CardTitle>
          <CardDescription>
            Delete permanentemente sua conta, essa ação não pode ser desfeita,
            sua conta deixará de existir em nosso banco de dados.
          </CardDescription>
        </CardHeader>
        {/* delete user content */}
        <CardContent>
          <UserDeleteButton />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
