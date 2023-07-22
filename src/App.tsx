import Column from '@/components/layout/column';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Task, useStore } from './store/store';
import './App.css';

function App() {
  // const { tasks, moveTask } = useStore();
  // const [todos, setTodos] = useState(tasks);
  const tasks = useStore(store => store.tasks);
  const moveTask = useStore(store => store.moveTask);

  function handleOnDragEnd(result: DropResult) {
    const { destination, source } = result;
    if (!destination) return;

    // let add,active = tasks
    console.log(tasks, tasks[0], null, 2);
    moveTask(result.draggableId, destination.droppableId);
    // console.log(source, 'to', destination);
  }

  return (
    <>
      <div className="flex flex-col items-center min-h-screen">
        <div className="flex items-center justify-center w-full h-20 mb-12 bg-secondary">
          <h1 className="text-3xl font-semibold">To DOoooooooooooo</h1>
        </div>
        <div className="flex flex-col items-center justify-center w-full md:flex-row md:items-start">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Column variant="planned" state="planned" droppableId="planned" />
            <Column variant="ongoing" state="ongoing" droppableId="ongoing" />
            <Column variant="done" state="done" droppableId="done" />
          </DragDropContext>
        </div>
      </div>
    </>
  );
}

export default App;
