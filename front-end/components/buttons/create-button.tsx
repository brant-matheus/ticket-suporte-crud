"use client";
import React from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

interface CreateButtonProps {
  title: string;
  action: Function;
}

const CreateButton = ({ title, action }: CreateButtonProps) => {
  return (
    <>
      <Button onClick={() => action()} className="gap-1">
        <PlusCircle className="h-4 w-4"></PlusCircle>
        Criar {title}
      </Button>
    </>
  );
};

export default CreateButton;
