import { useStore } from '@/store/store';
import { Badge, Variant } from '../ui/badge';
import { TrashIcon } from '@radix-ui/react-icons';
import { DetailedHTMLProps, forwardRef } from 'react';

interface Task
  extends DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  title: string;
  variant: Variant;
}

const Task = forwardRef<HTMLDivElement, Task>(({ title, variant }, ref) => {
  const task = useStore(store =>
    store.tasks.find(task => task.title === title)
  );
  const deleteTask = useStore(store => store.deleteTask);
  const setDraggTask = useStore(store => store.setDraggedTask);
  return (
    <div
      ref={ref}
      className="relative bg-[#131313] rounded-md min-h-[5rem] h-auto p-3 flex flex-col justify-between"
      draggable
      onDragStart={() => setDraggTask(task!.title)}
    >
      <div className="w-full h-full">
        <p className="w-auto h-auto break-words">{task?.title}</p>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <button className="group" onClick={() => deleteTask(title)}>
            <TrashIcon
              className="text-red-500 rounded-full group-hover:bg-secondary p-0.5 transition-colors duration-300"
              width={24}
              height={24}
            />
          </button>
        </div>
        <Badge variant={variant}>{task?.state}</Badge>
      </div>
    </div>
  );
});

export default Task;
