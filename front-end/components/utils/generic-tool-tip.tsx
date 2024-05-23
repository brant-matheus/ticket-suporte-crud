import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface ToolTipProps {
  path: string;
  icon: any;
  content?: string;
  variant: any;
}
export default function GenericToolTip({
  path,
  icon,
  content,
  variant,
}: ToolTipProps) {
  const router = useRouter();
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            onClick={() => router.push(path)}
            className="rounded-full"
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
