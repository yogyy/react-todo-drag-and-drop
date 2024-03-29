import React from "react";
import { Variant } from "../ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import Task from "../task";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Droppable } from "@hello-pangea/dnd";
import { TaskStatus, useTodos } from "@/store/todoStore";
import { CheckmarkIcon } from "../icons/checkmark";
import { PlusIcon } from "@radix-ui/react-icons";
import { formSchema } from "@/lib/schema";
import { ChecboxIcon } from "../icons/checkbox";
import { ChevronDownIcon } from "../icons/chevrondown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ColumnProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  state: TaskStatus;
  variant: Variant;
  droppableId: string;
}

export const Column = React.forwardRef<HTMLDivElement, ColumnProps>(
  ({ state, variant, droppableId, className }, ref) => {
    const addTodo = useTodos((store) => store.addTodos);
    const todos = useTodos((store) => store.todos[state]);

    const [modal, setModal] = React.useState(false);
    const title = (state: string): string => {
      switch (state) {
        case "planned":
          return "TO DO";
        case "ongoing":
          return "IN PROGRESS";
        case "done":
          return "DONE";
        default:
          return ""; // or provide a default value
      }
    };

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        task: "",
      },
    });
    const inputRef = React.useRef<HTMLInputElement>(null);
    function onSubmit(values: z.infer<typeof formSchema>) {
      addTodo(values.task, state);
      form.reset();
      setModal((prev) => !prev);
    }
    return (
      <div
        ref={ref}
        className={cn(
          "bg-secondary m-1.5 h-max rounded-md group/column max-w-[282px] min-w-[282px] flex-1",
          className
        )}>
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex gap-1 items-center text-xs">
            <h1 className="ml-2">{title(state)}</h1>
            {state === "done" && <CheckmarkIcon className="text-green-500" />}
          </div>
        </div>
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn(
                "flex flex-col w-full h-full min-h-[15rem] p-1.5 border-transparent",
                snapshot.isUsingPlaceholder && "border-biru border-y"
              )}>
              {todos.map((task, index) => (
                <Task
                  index={index}
                  key={task.id}
                  id={task.id}
                  variant={variant}
                  state={state}
                />
              ))}
              {provided.placeholder}
              <button
                className={cn(
                  "bg-secondary font-semibold text-sm text-primary items-center gap-1 p-2 mt-0.5 rounded-sm",
                  "group-hover/column:visible hover:cursor-pointer hover:bg-accent transition duration-300",
                  state === "planned" ? "visible" : "invisible",
                  modal ? "hidden" : "flex",
                  snapshot.isDraggingOver &&
                    state !== "planned" &&
                    "opacity-0 transition-none"
                )}
                onClick={() => {
                  if (inputRef.current) {
                    setModal((prev) => !prev);
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 0);
                  }
                }}>
                <PlusIcon className="fill-current w-4 h-4" />
                Create Issue
              </button>
              <div
                className={cn(
                  modal === true ? "block" : "hidden",
                  "p-2 border-2 border-biru"
                )}>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={cn(" mt-0.5 rounded-sm  relative")}
                    onBlur={() => setModal(false)}>
                    <FormField
                      control={form.control}
                      name="task"
                      render={({ field }) => (
                        <FormItem className="text-bg relative">
                          <FormControl ref={inputRef}>
                            <textarea
                              maxLength={100}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  form.handleSubmit(onSubmit)();
                                }
                                if (e.key === "Escape") {
                                  setModal(false);
                                }
                              }}
                              className="scrollbar-none placeholder:text-[14px] text-[14px] bg-bg overflow-y-scroll border-none outline-none resize-none rounded-sm text-primary min-h-10 flex justify-start w-full dark"
                              placeholder="What needs to be done?"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex items-center px-1 py-0.5 -ml-1 rounded-sm hover:bg-[#282D33] mt-1">
                        <ChecboxIcon />
                        <ChevronDownIcon />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Task</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
        </Droppable>
      </div>
    );
  }
);

export const ColumnMemo = React.memo(Column);
