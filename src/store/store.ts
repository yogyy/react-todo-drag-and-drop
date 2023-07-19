import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

type Task = {
  title: string;
  state: string;
};

type Store = {
  tasks: Task[];
  addTask: (title: string, state: string) => void;
  deleteTask: (title: string) => void;
  draggedTask: string | null;
  setDraggedTask: (title: string | null) => void;
  moveTask: (title: string, state: string) => void;
};

export const useStore = create<Store>()(
  persist(
    devtools(set => ({
      tasks: [],
      addTask: (title, state) =>
        set(
          store => ({
            tasks: [...store.tasks, { title, state }],
          }),
          false
        ),
      deleteTask: title =>
        set(store => ({
          tasks: store.tasks.filter(task => task.title !== title),
        })),
      draggedTask: null,
      setDraggedTask: title => set({ draggedTask: title }),
      moveTask: (title, state) =>
        set(store => ({
          tasks: store.tasks.map(task =>
            task.title === title ? { title, state } : task
          ),
        })),
    })),
    { name: 'todooo' }
  )
);
