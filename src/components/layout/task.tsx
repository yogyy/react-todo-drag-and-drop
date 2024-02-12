import { Variant } from "../ui/badge";
import { TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { DetailedHTMLProps, useRef, useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { TaskStatus, useTodos } from "@/store/todoStore";
import { useShallow } from "zustand/react/shallow";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskOrder } from "../task-order";
import { TaskMenu } from "../task-menu";

interface Task
  extends DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  id: string;
  variant: Variant;
  index: number;
  state: TaskStatus;
}

const formSchema = z.object({
  task: z
    .string()
    .min(2, {
      message: "task must be at least 2 characters.",
    })
    .max(100),
});

const Task = (props: Task) => {
  const { id, index, state } = props;
  const todo = useTodos((store) =>
    store.todos[state].find((task) => task.id === id)
  );
  const deleteTodo = useTodos((store) => store.deleteTodos);
  const editTodo = useTodos(useShallow((store) => store.editTodo));
  const [editModal, setEditModal] = useState(false);
  const setOrder = useTodos((store) => store.setCounter);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: todo?.title,
    },
  });

  let inputRef = useRef(null);

  function onSubmit(values: z.infer<typeof formSchema>) {
    editTodo(id, values.task);
    setEditModal((prev) => !prev);
    form.reset();
  }

  if (!todo) {
    return;
  }

  return (
    <Draggable
      key={todo?.id}
      draggableId={todo?.id}
      index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={cn(
            "relative bg-accent rounded-sm h-fit p-3 flex justify-between my-0.5 group/task",
            snapshot.isDragging && "outline outline-1 outline-biru",
            snapshot.isDropAnimating && todo?.state !== "done" && ""
          )}>
          <div className="w-[90%] h-full">
            <div className="h-auto w-full break-words flex-wrap relative inline">
              <span className="hover:underline text-[14px] leading-3">
                {todo?.title}
              </span>
              <Dialog
                open={editModal}
                onOpenChange={setEditModal}>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <DialogTrigger asChild>
                      <TooltipTrigger asChild>
                        <button className="absolute ml-1 hover:bg-[#A1BDD914] transition-colors duration-300 rounded-md invisible group-hover/task:visible">
                          <Pencil1Icon
                            className="p-0.5"
                            width={20}
                            height={20}
                          />
                        </button>
                      </TooltipTrigger>
                    </DialogTrigger>
                    <TooltipContent
                      align="center"
                      side="bottom"
                      className="bg-primary text-accent">
                      <span>Edit Summary</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Task!</DialogTitle>
                    <DialogDescription asChild>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-8">
                          <FormField
                            control={form.control}
                            name="task"
                            render={({ field }) => (
                              <FormItem className="text-bg">
                                <FormLabel>New Task</FormLabel>
                                <FormControl ref={inputRef}>
                                  <Input
                                    type="text"
                                    className="ring-offset-secondary ring-secondary border-secondary"
                                    placeholder="something"
                                    {...field}
                                    onClick={() => form.reset()}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit">Edit</Button>
                        </form>
                      </Form>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <TaskOrder order={todo.order} />
          </div>
          <TaskMenu className="flex-1" />
        </div>
      )}
    </Draggable>
  );
};

export default Task;
