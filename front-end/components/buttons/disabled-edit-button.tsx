import { PencilLine } from "lucide-react";
import { Button } from "../ui/button";

export default function DisabledEditButton() {
  return (
    <>
      <Button
        variant={"outline"}
        size={"icon"}
        className="border-green-600 cursor-not-allowed"
      >
        {" "}
        <PencilLine className="h-5 w-5 text-green-600 " />
      </Button>
    </>
  );
}
