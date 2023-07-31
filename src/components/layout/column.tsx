import { useState, useRef, forwardRef, DetailedHTMLProps } from 'react';
import { TaskStatus } from '@/store/store';
import { Variant } from '../ui/badge';
import { zodResolver } from '@hookform/resolvers/zod';
import Task from './task';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import Modal from './modal';
import { Droppable } from '@hello-pangea/dnd';
import useTodos from '@/store/todoStore';

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
      message: 'task must be at least 2 characters.',
    })
    .max(100),
});

const Column = forwardRef<HTMLDivElement, ColumnProps>(
  ({ state, variant, droppableId, className }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const addTodo = useTodos(store => store.addTodos);
    const todos = useTodos(store => store.todos[state]);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        task: '',
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
      addTodo(values.task, state);
      closeModal();
      form.reset();
    }

    return (
      <div
        ref={ref}
        className={cn(
          'bg-secondary min-h-[20rem] md:max-w-[20rem] h-full rounded-md sm:w-[50%] w-[calc(100%_-_20px)] md:w-1/3 m-2',
          className
        )}
      >
        <div className="flex items-center justify-between mx-2 my-1.5">
          <div className="font-semibold">
            <h1>{state}</h1>
          </div>

          <Button
            className="transition-colors duration-300"
            variant="outline"
            onClick={openModal}
          >
            Add
          </Button>
          <Modal
            closeModal={closeModal}
            isOpen={isOpen}
            initialFocus={completeButtonRef}
            title="Add New Task!"
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
                <Button type="submit">Add</Button>
              </form>
            </Form>
          </Modal>
        </div>
        <div>
          <Droppable droppableId={droppableId}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={cn(
                  'flex flex-col w-full min-h-[20rem] p-2',
                  snapshot.draggingOverWith &&
                    ((droppableId === 'planned' && 'bg-orange-300/40') ||
                      (droppableId === 'ongoing' && 'bg-sky-300/40') ||
                      (droppableId === 'done' && 'bg-green-500/30'))
                )}
                // onClick={() => console.log(snapshot)}
              >
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
              </div>
            )}
          </Droppable>
        </div>
      </div>
    );
  }
);

export default Column;
