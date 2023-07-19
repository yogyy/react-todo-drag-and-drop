import {
  useState,
  useRef,
  forwardRef,
  AllHTMLAttributes,
  DetailedHTMLProps,
} from 'react';
import { useStore } from '@/store/store';
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

interface ColumnProps
  extends DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  state: string;
  variant: Variant;
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
  ({ state, variant }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [drop, setDrop] = useState(false);
    const tasks = useStore(store =>
      store.tasks.filter(task => task.state === state)
    );
    const draggedTask = useStore(store => store.draggedTask);
    const addTask = useStore(store => store.addTask);
    const setDraggedTask = useStore(store => store.setDraggedTask);
    const moveTask = useStore(store => store.moveTask);

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
      addTask(values.task, state);
      closeModal();
      form.reset();
    }

    return (
      <div
        ref={ref}
        className={cn(
          'bg-secondary min-h-[20rem] md:max-w-[20rem] h-full rounded-md sm:w-[50%] w-[calc(100%_-_20px)] md:w-1/3 p-1 m-2',
          'border-dashed border-2 border-transparent',
          drop && 'border-accent'
        )}
        onDragOver={e => {
          e.preventDefault();
          setDrop(true);
        }}
        onDragLeave={e => {
          e.preventDefault();
          setDrop(false);
        }}
        onDrop={() => {
          moveTask(draggedTask!, state);
          setDraggedTask(null);
          setDrop(false);
        }}
      >
        <div className="flex items-center justify-between mx-2 mb-3">
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
        <div className="flex flex-col gap-1.5">
          {tasks.map((task, _i) => (
            <Task key={task.title + _i} title={task.title} variant={variant} />
          ))}
        </div>
      </div>
    );
  }
);

export default Column;
