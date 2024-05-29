import { PencilLine } from "lucide-react";

export default function DisabledEditButton() {
  return (
    <>
      <PencilLine className="h-5 w-5 text-green-600 cursor-not-allowed" />
    </>
  );
}
