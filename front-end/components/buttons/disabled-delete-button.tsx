import { Trash2 } from "lucide-react";

export default function DisabledDeleteButton() {
  return (
    <>
      <Trash2 className="text-[red] h-5 w-5 cursor-not-allowed	"></Trash2>
    </>
  );
}
