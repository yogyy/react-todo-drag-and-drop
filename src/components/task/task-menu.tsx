import React from "react";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";
import { TaskStatus, useTodos } from "@/store/todoStore";

const MenuItems = [
  { id: 1, label: "Copy Issue link" },
  { id: 2, label: "Copy Issue key" },
  { id: 3, type: "separator" },
  { id: 4, label: "Add flag" },
  { id: 5, label: "Add label" },
  { id: 6, type: "separator" },
  { id: 7, label: "Delete" },
];

interface MenuProps extends ButtonProps {
  taskId: string;
  state: TaskStatus;
}

const Menu = ({ taskId, state, className, ...props }: MenuProps) => {
  const [openMenu, setOpenMenu] = React.useState(false);
  const deleteTask = useTodos((store) => store.deleteTodos);
  return (
    <Popover
      open={openMenu}
      onOpenChange={setOpenMenu}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          onClick={() => setOpenMenu((prev) => !prev)}
          className={cn(
            "px-[2px] aspect-square -mr-1 -mt-1 max-h-8 max-w-8 hover:text-current hover:brightness-125 transition duration-300",
            openMenu ? "visible" : " invisible",
            " group-hover/task:visible",
            className
          )}
          style={{ backgroundColor: "#2C3339" }}
          {...props}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24">
            <g
              fill="currentColor"
              fillRule="evenodd">
              <circle
                cx="5"
                cy="12"
                r="2"></circle>
              <circle
                cx="12"
                cy="12"
                r="2"></circle>
              <circle
                cx="19"
                cy="12"
                r="2"></circle>
            </g>
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-fit border-[#3d474f] text-[#B6C2CF] font-extralight px-0 text-sm flex flex-col py-1 bg-[#282E33]">
        <PopoverClose className="sr-only">close</PopoverClose>
        <ul className="min-w-[12.5rem] max-h-[31.25rem] ">
          {MenuItems.map((item) => (
            <React.Fragment key={item.id}>
              {item.type === "separator" ? (
                <li className="w-full h-[1px] my-1 bg-[#3d474f]" />
              ) : (
                <li className="w-full">
                  <button
                    onClick={() => {
                      item.label === "Delete" && deleteTask(taskId, state);
                    }}
                    className={cn(
                      "px-5 py-2 flex text-left outline-none w-full focus-visible:outline-biru outline-2 -outline-offset-2",
                      item.label === "Delete"
                        ? "cursor-pointer hover:bg-[#323940] transition-colors"
                        : "cursor-not-allowed"
                    )}>
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
