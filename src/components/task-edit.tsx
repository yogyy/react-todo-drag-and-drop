import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTodos } from "@/store/todoStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const formSchema = z.object({
  task: z
    .string()
    .min(2, {
      message: "task must be at least 2 characters.",
    })
    .max(100),
});

const Edit = ({ id, state }: { state: string; id: string }) => {
  const todo = useTodos((store) =>
    store.todos[state].find((task) => task.id === id)
  );
  const editTodo = useTodos((store) => store.editTodo);
  const [editModal, setEditModal] = React.useState(false);
  let inputRef = React.useRef(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: todo?.title,
    },
  });
  if (!todo) {
    return;
  }
  function onSubmit(values: z.infer<typeof formSchema>) {
    editTodo(id, values.task);
    setEditModal((prev) => !prev);
    form.reset();
  }

  return (
    <Dialog
      open={editModal}
      onOpenChange={setEditModal}>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "absolute bg-accent hover:bg-[#2B333A] transition-colors duration-300 rounded-md invisible group-hover/task:visible",
                  todo.title.length >= 30 && "-ml-4"
                )}>
                <div className="w-6 h-6 flex items-center justify-center">
                  <Pencil1Icon
                    width={20}
                    height={20}
                  />
                </div>
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
  );
};

export const TaskEdit = React.memo(Edit);
