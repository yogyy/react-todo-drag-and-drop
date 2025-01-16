import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Draggable } from "@hello-pangea/dnd";
import { useTodos } from "@/store/todoStore";
import { cn } from "@/lib/utils";
import { TaskMenu } from "./task-menu";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { formSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTextarea } from "@/hooks/use-adjust-textarea";
import { TaskVariant } from "@/types";

interface Task
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  id: string;
  index: number;
  state: TaskVariant;
}

const Task = React.memo(function ({ id, index, state }: Task) {
  const [editTask, setEditTask] = React.useState(false);
  const todo = useTodos((store) =>
    store.todos[state].find((task) => task.id === id),
  );
  if (!todo) return;

  const editTodo = useTodos((store) => store.editTodo);

  const { textareaRef, adjustTextareaHeight } = useTextarea();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { task: todo?.title },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.task.trim().length !== 0) {
      editTodo(id, values.task);
      setEditTask(false);
    } else {
      setEditTask(true);
    }
  }

  return (
    <Draggable index={index} draggableId={todo?.id}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={cn(
            "group/task group/task relative my-0.5 flex h-fit justify-between rounded-sm bg-accent p-3",
            snapshot.isDragging && "outline outline-1 outline-biru",
          )}
        >
          <div className="w-[87%]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                  "relative w-full rounded-sm border border-biru bg-bg",
                  editTask ? "block" : "hidden",
                )}
                onBlur={() => setEditTask(false)}
              >
                <FormField
                  control={form.control}
                  name="task"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl ref={textareaRef}>
                        <textarea
                          rows={1}
                          maxLength={100}
                          spellCheck={false}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              form.handleSubmit(onSubmit)();
                            }
                            if (e.key === "Escape") {
                              setEditTask(false);
                            }
                          }}
                          className="flex h-auto w-full resize-none justify-start break-words rounded-sm border-none bg-bg pb-[2.5px] text-[14px] leading-5 outline-none scrollbar-none"
                          placeholder="What needs to be done?"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            {!editTask && (
              <div
                className={cn(
                  "relative w-full border border-transparent",
                  editTask ? "hidden" : "block",
                )}
              >
                <div
                  className="overflow-hidden text-ellipsis pb-1.5 text-[14px] hover:underline"
                  onClick={() => {
                    if (textareaRef?.current) {
                      setEditTask((prev) => !prev);
                      setTimeout(() => {
                        textareaRef.current?.focus();
                        adjustTextareaHeight();
                      }, 0);
                    }
                  }}
                >
                  <p
                    className={cn(
                      "cursor-text whitespace-pre-wrap break-words pb-[1.8px] leading-5",
                      state === "done" ? "line-through decoration-2" : "",
                    )}
                  >
                    {todo.title}
                  </p>
                </div>
              </div>
            )}
            <div className="mt-1.5 flex h-8 w-full items-center justify-between gap-2">
              <span
                className={cn(
                  "relative inline-flex justify-center text-[0.65rem] leading-4 text-opacity-70",
                  state === "planned" && "text-orange-300",
                  state === "ongoing" && "text-sky-300",
                  state === "done" && "text-green-500",
                )}
              >
                {`KAN-${todo.order}`}
              </span>
            </div>
          </div>
          <TaskMenu state={state} taskId={todo.id} />
        </div>
      )}
    </Draggable>
  );
});

export default Task;
