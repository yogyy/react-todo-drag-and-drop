import {
  useRef,
  forwardRef,
  DetailedHTMLProps,
  useState,
  useEffect,
} from "react";
import { Variant } from "../ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import Task from "./task";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Droppable } from "@hello-pangea/dnd";
import { TaskStatus, useTodos } from "@/store/todoStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckmarkIcon } from "../icons/checkmark";
import { PlusIcon } from "@radix-ui/react-icons";

interface ColumnProps
  extends DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  state: TaskStatus;
  variant: Variant;
  droppableId: string;
}
const formSchema = z.object({
  task: z
    .string()
    .min(2, {
      message: "task must be at least 2 characters.",
    })
    .max(100),
});

const Column = forwardRef<HTMLDivElement, ColumnProps>(
  ({ state, variant, droppableId, className }, ref) => {
    const addTodo = useTodos((store) => store.addTodos);
    const todos = useTodos((store) => store.todos[state]);
    const arrTodo = useTodos((store) => store.todos);
    const [modal, setModal] = useState(false);
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

    const inputRef = useRef<HTMLInputElement>(null);
    function onSubmit(values: z.infer<typeof formSchema>) {
      addTodo(values.task, state);
      form.reset();
      setModal((prev) => !prev);
    }

    return (
      <div
        ref={ref}
        className={cn(
          "bg-secondary flex-auto mx-1.5 h-full rounded-md group/column max-w-[282px] min-w-[282px]",
          className
        )}>
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex gap-1 items-center text-xs">
            <h1 className="ml-2">{title(state)}</h1>
            {todos.length >= 1 ? (
              <span>
                {todos.length} {modal ? "true" : "false"}
              </span>
            ) : null}
            {state === "done" && <CheckmarkIcon className="text-green-500" />}
          </div>
        </div>
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn(
                "flex flex-col w-full min-h-[15rem] p-1.5 border-transparent",
                snapshot.isUsingPlaceholder && "border-[#0065ff] border-y"
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
                  "bg-secondary font-semibold text-sm text-primary hover:bg-accent transition duration-300 items-center gap-1 p-2 mt-0.5 rounded-sm",
                  state === "planned" ? "visible" : "invisible",
                  modal ? "hidden" : "flex",
                  "group-hover/column:visible hover:cursor-pointer"
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
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className={cn(
                    "p-2 border-2 mt-1 rounded-sm border-biru relative",
                    modal === true ? "block" : "hidden"
                  )}
                  onBlur={() => setModal((prev) => !prev)}>
                  <FormField
                    control={form.control}
                    name="task"
                    render={({ field }) => (
                      <FormItem className="text-bg">
                        <FormControl ref={inputRef}>
                          <textarea
                            maxLength={100}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                form.handleSubmit(onSubmit)();
                              }
                            }}
                            className="add-todo bg-accent overflow-hidden overflow-y-scroll border-none outline-none resize-none rounded-sm text-primary min-h-10 flex justify-start w-full dark"
                            placeholder="What needs to be done?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          )}
        </Droppable>
      </div>
    );
  }
);

export default Column;
