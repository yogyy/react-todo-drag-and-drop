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
};

export const useStore = create<Store>()(
  persist(
    devtools(set => ({
      tasks: [],
      plannedTasks: [],
      ongoingTasks: [],
      doneTasks: [],
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
    })),
    { name: 'todooo' }
  )
);
