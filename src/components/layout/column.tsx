import React from "react";
import { Badge } from "../ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import Task from "../task";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Droppable } from "@hello-pangea/dnd";
import { useTodos } from "@/store/todoStore";
import { PlusIcon } from "@radix-ui/react-icons";
import { formSchema } from "@/lib/schema";
import { TaskVariant } from "@/types";

interface ColumnProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  variant: TaskVariant;
}

const columnTitle = (state: string): string => {
  const titles: Record<string, string> = {
    planned: "TO DO",
    ongoing: "IN PROGRESS",
    done: "DONE",
  };

  return titles[state] || "";
};

export const Column = React.forwardRef<HTMLDivElement, ColumnProps>(
  ({ variant, className }, ref) => {
    const addTodo = useTodos((store) => store.addTodos);
    const todos = useTodos((store) => store.todos[variant]);
    const [isAddingtodo, setIsAddingTodo] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        task: "",
      },
    });
    const inputRef = React.useRef<HTMLInputElement>(null);
    function onSubmit(values: z.infer<typeof formSchema>) {
      addTodo(values.task, variant);
      form.reset();
      setIsAddingTodo((prev) => !prev);
    }

    return (
      <div
        ref={ref}
        className={cn(
          "group/column m-1.5 h-max w-4/5 min-w-[282px] flex-1 rounded-md bg-secondary md:max-w-[282px]",
          className,
        )}
      >
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex h-6 w-full items-center justify-between text-xs">
            <Badge variant={variant} className="ml-2 cursor-default font-bold">
              <h1>{columnTitle(variant)}</h1>
            </Badge>
            {variant === "planned" ? (
              <button
                className={cn(
                  "mt-0.5 items-center rounded-md bg-secondary p-1.5 text-sm font-semibold text-white/70",
                  "transition duration-300 group-hover/column:visible hover:cursor-pointer hover:bg-accent",
                  isAddingtodo ? "hidden" : "flex",
                )}
                onClick={() => {
                  if (inputRef.current) {
                    setIsAddingTodo((prev) => !prev);
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 0);
                  }
                }}
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </div>
        <Droppable droppableId={variant}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn(
                "flex h-full min-h-[15rem] w-full flex-col border-y border-transparent p-1.5",
                snapshot.isUsingPlaceholder && "border-biru",
              )}
            >
              {todos.map((task, index) => (
                <Task
                  index={index}
                  key={task.id}
                  id={task.id}
                  state={variant}
                />
              ))}
              {provided.placeholder}

              {variant === "planned" ? (
                <div
                  className={cn(
                    "border-2 border-biru p-2",
                    isAddingtodo === true ? "block" : "hidden",
                  )}
                >
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="relative mt-0.5 rounded-sm"
                      onBlur={() => setIsAddingTodo(false)}
                    >
                      <FormField
                        control={form.control}
                        name="task"
                        render={({ field }) => (
                          <FormItem className="relative text-bg">
                            <FormControl ref={inputRef}>
                              <textarea
                                maxLength={100}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    form.handleSubmit(onSubmit)();
                                  }
                                  if (e.key === "Escape") {
                                    setIsAddingTodo(false);
                                  }
                                }}
                                className="flex min-h-10 w-full resize-none justify-start overflow-y-scroll rounded-sm border-none bg-bg text-[14px] text-primary outline-none scrollbar-none placeholder:text-[14px]"
                                placeholder="What needs to be done?"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </div>
              ) : null}
            </div>
          )}
        </Droppable>
      </div>
    );
  },
);

export const ColumnMemo = React.memo(Column);
