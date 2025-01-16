import React from "react";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTodos } from "@/store/todoStore";
import { TaskVariant } from "@/types";
import { PopoverArrow } from "@radix-ui/react-popover";

const MenuItems = [
  { id: 1, label: "Copy Issue link" },
  { id: 2, label: "Copy Issue key" },
  { id: 3, type: "separator" },
  { id: 4, label: "Add flag" },
  { id: 5, label: "Add label" },
  { id: 6, type: "separator" },
  { id: 7, label: "Delete" },
];

interface MenuProps {
  taskId: string;
  state: TaskVariant;
}

export const Menu = ({ taskId, state }: MenuProps) => {
  const deleteTask = useTodos((store) => store.deleteTodos);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="task menu"
          className={cn(
            "-mr-1 -mt-1 inline-flex aspect-square h-9 max-h-8 max-w-8 items-center justify-center rounded-md px-[2px] py-2 transition duration-300 focus-visible:outline-none",
            "invisible group-focus-within/task:visible group-hover/task:visible hover:text-current hover:brightness-125 focus-visible:ring-0 focus-visible:brightness-125",
          )}
        >
          <ThreeDots />
        </button>
      </PopoverTrigger>
      <PopoverContent
        arrowPadding={2}
        align="end"
        className="flex w-fit flex-col border-[#3d474f] bg-[#282E33] px-0 py-1 text-sm font-extralight text-[#B6C2CF]"
      >
        <PopoverArrow style={{ fill: "#3d474f" }} />
        <PopoverClose className="sr-only">close</PopoverClose>
        <ul className="max-h-[31.25rem] min-w-[12.5rem]">
          {MenuItems.map((item) => (
            <React.Fragment key={item.id}>
              {item.type === "separator" ? (
                <li className="my-1 h-[1px] w-full bg-[#3d474f]" />
              ) : (
                <li className="w-full">
                  <button
                    onClick={() => {
                      item.label === "Delete" && deleteTask(taskId, state);
                    }}
                    className={cn(
                      "flex w-full px-5 py-2 text-left outline-none outline-2 -outline-offset-2 focus-visible:outline-biru",
                      item.label === "Delete"
                        ? "cursor-pointer transition-colors hover:bg-[#323940]"
                        : "cursor-not-allowed",
                    )}
                  >
                    <span className="w-full">{item.label}</span>
                  </button>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export const TaskMenu = React.memo(Menu);

const ThreeDots = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <g fill="currentColor" fillRule="evenodd">
        <circle cx="5" cy="12" r="2"></circle>
        <circle cx="12" cy="12" r="2"></circle>
        <circle cx="19" cy="12" r="2"></circle>
      </g>
    </svg>
  );
};
