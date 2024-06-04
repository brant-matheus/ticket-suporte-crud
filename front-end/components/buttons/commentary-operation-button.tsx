import { ArrowUpFromLine } from "lucide-react";

interface ActionButtonProps {
  action: Function;
}
export default function CommentaryOperationButton({
  action,
}: ActionButtonProps) {
  return (
    <ArrowUpFromLine
      className="h-5 w-5 text-yellow-400 cursor-pointer"
      onClick={() => action()}
    />
  );
}
