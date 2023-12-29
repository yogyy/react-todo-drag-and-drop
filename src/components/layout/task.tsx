import { TaskStatus } from '@/store/store';
import { Badge, Variant } from '../ui/badge';
import { TrashIcon, Pencil2Icon } from '@radix-ui/react-icons';
import { DetailedHTMLProps, useRef, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import useTodos from '@/store/todoStore';
import Modal from './modal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '../ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

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
      message: 'task must be at least 2 characters.',
    })
    .max(100),
});

const Task = (props: Task) => {
  const { id, variant, index, state } = props;
  const [isOpen, setIsOpen] = useState(false);
  const todo = useTodos(store =>
    store.todos[state].find(task => task.id === id)
  );
  const deleteTodo = useTodos(store => store.deleteTodos);
  const editTodo = useTodos(store => store.editTodo);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: todo?.title,
    },
  });

  let completeButtonRef = useRef(null);
  let inputRef = useRef(null);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    editTodo(id, values.task);
    closeModal();
    form.reset();
  }

  return (
    <Draggable key={todo?.id!} draggableId={todo?.id!} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={cn(
            'relative bg-[#131313] rounded-md min-h-[5rem] h-auto p-3 flex flex-col justify-between my-0.5',
            snapshot.isDragging &&
              ((todo?.state === 'planned' && 'text-orange-300') ||
                (todo?.state === 'ongoing' && 'text-sky-300') ||
                (todo?.state === 'done' && 'text-green-500')),
            snapshot.isDragging && 'outline outline-primary'
          )}
          onClick={() => console.log(provided)}
        >
          <div className="w-full h-full">
            <p className="w-auto h-auto break-words">{todo?.title}</p>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <button className="group" onClick={() => deleteTodo(id, state)}>
                <TrashIcon
                  className="text-red-500 rounded-md group-hover:bg-secondary p-0.5 transition-colors duration-300"
                  width={24}
                  height={24}
                />
              </button>
              <button className="group" onClick={openModal}>
                <Pencil2Icon
                  className="text-teal-50 rounded-md group-hover:bg-secondary p-0.5 transition-colors duration-300"
                  width={24}
                  height={24}
                />
              </button>
            </div>
            <Badge variant={variant}>{todo?.state}</Badge>
          </div>
          <Modal
            closeModal={closeModal}
            isOpen={isOpen}
            initialFocus={completeButtonRef}
            title="Edit Task!"
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
          </Modal>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
