import React from "react";
import { ChecboxIcon } from "./icons/checkbox";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskOrderProps extends React.HTMLAttributes<HTMLDivElement> {
  order: number;
}
const Order = ({ order, className }: TaskOrderProps) => {
  return (
    <div className={cn("flex items-center gap-2 mt-1.5 h-8", className)}>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger>
            <ChecboxIcon />
          </TooltipTrigger>
          <TooltipContent>Task</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger className="text-xs leading-4 relative group/kan inline-flex justify-center">{`KAN-${order}`}</TooltipTrigger>
          <TooltipContent>{`KAN-${order}`}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const TaskOrder = React.memo(Order);
