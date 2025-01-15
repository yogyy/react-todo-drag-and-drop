import { ColumnMemo } from "@/components/layout/column";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useTodos } from "./store/todoStore";
import { Button } from "./components/ui/button";
import { Title } from "./components/title";

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
      destination.index,
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center">
      <div className="mb-12 flex h-20 w-full items-center justify-center bg-secondary">
        <Title />
      </div>
      <div>
        <Button
          variant="outline"
          className="hover:bg-accent hover:text-white"
          onClick={() => resetOrderNumber(1)}
        >
          Reset order
        </Button>
      </div>
      <div className="flex h-full w-full flex-col items-center justify-start overflow-x-scroll md:flex-row md:items-start min-[914px]:justify-center min-[914px]:overflow-x-hidden">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <ColumnMemo variant="planned" />
          <ColumnMemo variant="ongoing" />
          <ColumnMemo variant="done" />
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
