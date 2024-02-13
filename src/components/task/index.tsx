import { Variant } from "../ui/badge";
import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { TaskStatus, useTodos } from "@/store/todoStore";
import { cn } from "@/lib/utils";
import { TaskOrder } from "./task-order";
import { TaskMenu } from "./task-menu";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { formSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTextarea } from "@/hooks/use-adjust-textarea";

interface Task
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  id: string;
  variant: Variant;
  index: number;
  state: TaskStatus;
}

const Task = React.memo(function (props: Task) {
  const { id, index, state } = props;
  const [editModal, setEditModal] = React.useState(false);
  const todos = useTodos((store) => store.todos);

  const todo = todos[state].find((task) => task.id === id);
  const editTodo = useTodos((store) => store.editTodo);

  const { textareaRef, adjustTextareaHeight } = useTextarea();
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
          <div
            className={cn("h-full relative", editModal ? "w-full" : "w-[87%]")}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                  "p-0.5 px-2 border-2 mt-0.5 rounded-sm border-biru relative bg-bg",
                  editModal ? "block" : "hidden"
                )}
                onBlur={() => setEditModal(false)}>
                <FormField
                  control={form.control}
                  name="task"
                  render={({ field }) => (
                    <FormItem className=" relative">
                      <FormControl ref={textareaRef}>
                        <textarea
                          rows={1}
                          maxLength={100}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              form.handleSubmit(onSubmit)();
                            }
                            if (e.key === "Escape") {
                              setEditModal(false);
                            }
                          }}
                          className="scrollbar-none mt-0.5 text-[14px] bg-bg border-none outline-none resize-none rounded-sm h-10 flex justify-start w-full"
                          placeholder="What needs to be done?"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            {!editModal && (
              <div
                className={cn(
                  "relative h-auto w-auto",
                  editModal ? "hidden" : "flex"
                )}>
                <div className="hover:underline group/todo break-words text-ellipsis overflow-hidden leading-6 text-[14px]">
                  <span>
                    {todo.title}
                    <button
                      onClick={() => {
                        if (textareaRef?.current) {
                          setEditModal((prev) => !prev);
                          setTimeout(() => {
                            textareaRef.current?.focus();
                            adjustTextareaHeight();
                          }, 0);
                        }
                      }}
                      className={cn(
                        "absolute ml-1 bg-accent hover:bg-[#2B333A] transition-colors duration-300 rounded-md invisible group-hover/task:visible"
                      )}>
                      <div className="w-6 h-6 flex items-center justify-center">
                        <Pencil1Icon
                          width={20}
                          height={20}
                        />
                      </div>
                    </button>
                  </span>
                </div>
              </div>
            )}
            <TaskOrder
              state={state}
              isDragging={snapshot.isDragging}
              order={todo.order}
            />
          </div>
          <TaskMenu
            state={state}
            taskId={todo.id}
            className={cn(editModal ? "hidden" : "flex-1 w-[13%]")}
          />
        </div>
      )}
    </Draggable>
  );
});

export default Task;
