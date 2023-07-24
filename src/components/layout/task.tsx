import { useStore } from '@/store/store';
import { Badge, Variant } from '../ui/badge';
import { TrashIcon } from '@radix-ui/react-icons';
import { DetailedHTMLProps } from 'react';
import { Draggable } from '@hello-pangea/dnd';

interface Task
  extends DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  id: string;
  variant: Variant;
  index: number;
}

const Task = (props: Task) => {
  const { id, variant, index } = props;
  const task = useStore(store => store.tasks.find(task => task.id === id));
  const deleteTask = useStore(store => store.deleteTask);
  return (
    <Draggable key={task?.id!} draggableId={task?.id!} index={index}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="relative bg-[#131313] rounded-md min-h-[5rem] h-auto p-3 flex flex-col justify-between my-0.5"
        >
          <div className="w-full h-full">
            <p className="w-auto h-auto break-words">{task?.title}</p>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <button className="group" onClick={() => deleteTask(id)}>
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
      )}
    </Draggable>
  );
};

export default Task;
