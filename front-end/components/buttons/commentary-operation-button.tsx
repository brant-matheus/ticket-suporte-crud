import { ArrowUpFromLine } from "lucide-react";
import { Button } from "../ui/button";

interface ActionButtonProps {
  action: Function;
}
export default function CommentaryOperationButton({
  action,
}: ActionButtonProps) {
  return (
    <Button
      variant={"outline"}
      onClick={() => action()}
      size={"icon"}
      className="border-yellow-400"
    >
      <ArrowUpFromLine className="h-5 w-5 text-yellow-400 cursor-pointer" />
    </Button>
  );
}
