import { create } from 'zustand';
import { Task, TaskStatus } from './store';
import { v1 as uuidv1 } from 'uuid';
import { persist } from 'zustand/middleware';

type Todos = {
  planned: Task[];
  ongoing: Task[];
  done: Task[];
};

type Store = {
  todos: Todos;
  addTodos: (title: string, state: TaskStatus) => void;
  deleteTodos: (id: string, state: TaskStatus) => void;
};
// Define the store
const useTodos = create<Store>()(
  persist(
    set => ({
      todos: {
        planned: [],
        ongoing: [],
        done: [],
      },
      addTodos: (title, state) => {
        set(prev => {
          const newTask = { title, status: state, id: uuidv1() };
          return {
            todos: {
              ...prev.todos,
              [state]: [...prev.todos[state as keyof Todos], newTask],
            },
          };
        });
      },
      deleteTodos: (id, state) => {
        set(prev => {
          return {
            todos: {
              ...prev.todos,
              [state]: prev.todos[state].filter(task => task.id !== id),
            },
          };
        });
      },
    }),
    { name: 'to-doooo' }
  )
);

export default useTodos;
