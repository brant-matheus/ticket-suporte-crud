import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export default function DisabledDeleteButton() {
  return (
    <>
      <Button
        variant={"outline"}
        size={"icon"}
        className="border-[red] cursor-not-allowed	"
      >
        <Trash2 className="text-[red] h-5 w-5 "></Trash2>
      </Button>
    </>
  );
}
