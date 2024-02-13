import { ColumnMemo } from "@/components/layout/column";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useTodos } from "./store/todoStore";
import { Button } from "./components/ui/button";

function App() {
  const orderTask = useTodos((store) => store.moveTaskBetweenCategories);
  const resetOrderNumber = useTodos((store) => store.resetCounter);
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
      <div>
        <Button
          variant="outline"
          className="hover:bg-accent hover:text-white"
          onClick={() => resetOrderNumber(1)}>
          Reset order
        </Button>
      </div>
      <div className="flex flex-col items-center h-full justify-center w-full md:flex-row md:items-start overflow-x-scroll scrollbar-none md:justify-start lg:justify-center">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <ColumnMemo
            variant="planned"
            state="planned"
            droppableId="planned"
          />
          <ColumnMemo
            variant="ongoing"
            state="ongoing"
            droppableId="ongoing"
          />
          <ColumnMemo
            variant="done"
            state="done"
            droppableId="done"
          />
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
