import Column from '@/components/layout/column';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useStore } from './store/store';
import './App.css';

function App() {
  const tasks = useStore(store => store.tasks);
  const orderTask = useStore(store => store.moveTaskBetweenCategories);

  function handleOnDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return console.info(tasks);
    }

    orderTask(draggableId, destination.droppableId, destination.index);
    // moveTask(result.draggableId, destination.droppableId);
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
