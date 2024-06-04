import { Plus, PlusCircle } from "lucide-react";
interface ActionButtonProps {
  action: Function;
}
export default function ActionCreateButton({ action }: ActionButtonProps) {
  return (
    <PlusCircle
      onClick={() => action()}
      className="w-5 h-5 cursor-pointer text-blue-500"
    />
  );
}
