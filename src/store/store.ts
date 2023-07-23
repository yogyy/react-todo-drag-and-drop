import { v1 as uuidv1 } from 'uuid';
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export type TaskStatus = 'planned' | 'ongoing' | 'done' | string;

export type Task = {
  title: string;
  state: TaskStatus | string;
  id: string;
};

type Store = {
  tasks: Task[];
  addTask: (title: string, state: TaskStatus) => void;
  deleteTask: (id: string) => void;
  draggedTask: string | null;
  setDraggedTask: (title: string | null) => void;
  moveTask: (id: string, state: TaskStatus) => void;
  moveTaskBetweenCategories: (
    taskId: string,
    targetCategory: TaskStatus,
    targetIndex: number
  ) => void;
};

export const useStore = create<Store>()(
  persist(
    devtools(set => ({
      tasks: [],

      addTask: (title, state) =>
        set(
          store => ({
            tasks: [...store.tasks, { title, state, id: uuidv1() }],
          }),
          false
        ),
      deleteTask: id =>
        set(store => ({
          tasks: store.tasks.filter(task => task.id !== id),
        })),
      draggedTask: null,
      setDraggedTask: title => set({ draggedTask: title }),
      moveTask: (
        id,
        state // Change the argument to accept an ID
      ) =>
        set(store => ({
          tasks: store.tasks.map(task =>
            task.id === id ? { ...task, state } : task
          ),
        })),
      moveTaskBetweenCategories: (
        taskId: string,
        targetCategory: TaskStatus,
        targetIndex: number
      ) =>
        set((store: Store) => {
          const { tasks } = store;
          const sourceIndex = tasks.findIndex(task => task.id === taskId);

          if (
            sourceIndex === -1 ||
            targetIndex < 0 ||
            targetIndex > tasks.length
          ) {
            // Invalid indices, do nothing
            return store; // Return the original store to avoid the error
          }

          const taskToMove = tasks[sourceIndex];
          const newTasks = tasks.filter(task => task.id !== taskId);

          if (targetCategory === 'done' && targetIndex >= tasks.length) {
            // Move to the 'done' category at the end of the array
            newTasks.push({ ...taskToMove, state: targetCategory });
          } else {
            // Move to other categories or within the same category
            newTasks.splice(targetIndex, 0, {
              ...taskToMove,
              state: targetCategory,
            });
          }

          return { tasks: newTasks };
        }),
    })),
    { name: 'todooo' }
  )
);
