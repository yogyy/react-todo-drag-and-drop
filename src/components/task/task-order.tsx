import React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckmarkIcon } from "../icons/checkmark";
import { TaskVariant } from "@/types";

interface TaskOrderProps {
  state: TaskVariant;
  order: number;
}
const Order = ({ state, order }: TaskOrderProps) => {
  return (
    <div className="mt-1.5 flex h-8 w-full items-center justify-between gap-2">
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger
            className={cn(
              "relative inline-flex justify-center text-[0.65rem] leading-4 text-primary/70",
              state === "done" ? "line-through decoration-2" : "",
            )}
          >
            {`KAN-${order}`}
          </TooltipTrigger>
          <TooltipContent>{`KAN-${order}`}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {state === "done" && <CheckmarkIcon className="text-green-500" />}
    </div>
  );
};

export const TaskOrder = React.memo(Order);
