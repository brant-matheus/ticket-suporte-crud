import { Plus, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
interface ActionButtonProps {
  action: Function;
}
export default function ActionCreateButton({ action }: ActionButtonProps) {
  return (
    <Button variant={"outline"} onClick={() => action()} size={"icon"} className="border-blue-500">
      <PlusCircle className="w-5 h-5 cursor-pointer text-blue-500" />
    </Button>
  );
}
