import React from "react";
import { ChecboxIcon } from "../icons/checkbox";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TaskStatus } from "@/store/todoStore";
import { CheckmarkIcon } from "../icons/checkmark";

interface TaskOrderProps extends React.HTMLAttributes<HTMLDivElement> {
  state: TaskStatus;
  order: number;
  isDragging: boolean;
}
const Order = ({ state, isDragging, order, className }: TaskOrderProps) => {
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
          <TooltipTrigger
            className={cn(
              "text-xs leading-4 relative group/kan inline-flex justify-center",
              state === "done" ? "line-through decoration-2" : ""
            )}>
            {`KAN-${order}`}
          </TooltipTrigger>
          <TooltipContent>{`KAN-${order}`}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {state === "done" && !isDragging && (
        <CheckmarkIcon className="text-green-500 absolute right-0 -mt-1" />
      )}
    </div>
  );
};

export const TaskOrder = React.memo(Order);
