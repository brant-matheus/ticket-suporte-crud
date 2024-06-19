import React from "react";
import { PencilLine } from "lucide-react";
import { Button } from "../ui/button";

interface EditButtonProps {
  action: Function;
}
const EditButton = ({ action }: EditButtonProps) => {
  return (
    <>
      <Button
        variant={"outline"}
        size={"icon"}
        className="border-green-600 cursor-pointer"
        onClick={() => action()}
      >
        {" "}
        <PencilLine className="h-5 w-5 text-green-600 " />
      </Button>
    </>
  );
};

export default EditButton;
