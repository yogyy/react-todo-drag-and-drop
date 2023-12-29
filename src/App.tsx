import Column from '@/components/layout/column';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import './App.css';
import { useTodos } from './store/todoStore';

function App() {
  const orderTask = useTodos(store => store.moveTaskBetweenCategories);

  function handleOnDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    orderTask(
      draggableId,
      source.droppableId,
      destination.droppableId,
      destination.index
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="flex items-center justify-center w-full h-20 mb-12 bg-secondary">
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-orange-500 via-sky-500 to-green-500 bg-clip-text text-transparent motion-safe:animate-gradient-x">
          To DOoooooooooooo
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center w-full md:flex-row md:items-start">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Column variant="planned" state="planned" droppableId="planned" />
          <Column variant="ongoing" state="ongoing" droppableId="ongoing" />
          <Column variant="done" state="done" droppableId="done" />
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
