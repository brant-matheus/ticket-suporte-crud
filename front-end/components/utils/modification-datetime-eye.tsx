import React from "react";
import { DateTime } from "luxon";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface props {
  createdAtProps: string;
  updatedAtProps: string;
  title: string;
}
const ModificationEye = ({ createdAtProps, updatedAtProps, title }: props) => {
  const createdAt = DateTime.fromISO(createdAtProps, {
    locale: "pt-BR",
  }).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);

  // user update at date time
  const updateAt = DateTime.fromISO(updatedAtProps, {
    locale: "pt-BR",
  }).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="cursor-default">
            <Eye />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="">
            <p>
              {title} criado em: {createdAt}
            </p>
            {updateAt === createdAt ? (
              <p>{title} ainda não foi editado</p>
            ) : (
              <p>
                {title} editado em: {updateAt}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ModificationEye;
