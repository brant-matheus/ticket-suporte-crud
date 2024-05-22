"EditButton";
import React from "react";
import { Button } from "../ui/button";
import { PencilLine } from "lucide-react";

interface EditButtonProps {
  action: Function;
}
const EditButton = ({ action }: EditButtonProps) => {
  return (
    <>
      <Button onClick={() => action()}>
        <PencilLine className="h-5 w-5 text-green-600" />
      </Button>
    </>
  );
};

export default EditButton;
