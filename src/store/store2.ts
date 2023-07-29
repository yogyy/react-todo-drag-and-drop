import { create } from 'zustand';
import { Task, TaskStatus } from './store';
import { v1 as uuidv1 } from 'uuid';
import { persist } from 'zustand/middleware';

type Todos = {
  [category: string]: Task[];
};

type Store = {
  todos: Todos;
  addTodos: (title: string, state: TaskStatus) => void;
  deleteTodos: (id: string, state: TaskStatus) => void;
  moveTaskBetweenCategories: (
    taskId: string,
    targetCategory: string,
    targetIndex: number
  ) => void;
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
          const newTask = { title, state, id: uuidv1() };
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
      moveTaskBetweenCategories: (
        taskId: string,
        targetCategory: string,
        targetIndex: number
      ) =>
        set((store: Store) => {
          const { todos } = store;

          const sourceCategory = Object.keys(todos).find(category =>
            todos[category].some(task => task.id === taskId)
          );

          if (!sourceCategory || targetIndex < 0) {
            // Invalid indices or categories, do nothing
            return store; // Return the original store to avoid the error
          }

          const sourceTasks = todos[sourceCategory];
          const taskToMoveIndex = sourceTasks.findIndex(
            task => task.id === taskId
          );

          if (taskToMoveIndex === -1 || targetIndex > sourceTasks.length) {
            // Invalid indices, do nothing
            return store; // Return the original store to avoid the error
          }

          const taskToMove = sourceTasks.splice(taskToMoveIndex, 1)[0];

          // Move the task to the target category and reset its order
          todos[targetCategory].splice(targetIndex, 0, {
            ...taskToMove,
            state: targetCategory,
          });

          return { todos: { ...todos } };
        }),
    }),
    { name: 'to-doooo' }
  )
);

export default useTodos;
