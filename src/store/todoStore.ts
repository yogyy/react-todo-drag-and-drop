import { nanoid } from "nanoid";
import { create } from "zustand";
import { TaskVariant } from "@/types";
import { persist } from "zustand/middleware";

interface Task {
  title: string;
  state: TaskVariant | string;
  id: string;
  order: number;
}

interface Todos {
  [category: string]: Task[];
}

type TodoStore = {
  todos: Todos;
  counter: number;
  setCounter: (id: string, newOrder: number) => void;
  resetCounter: (counter: number) => void;
  addTodos: (title: string, state: TaskVariant) => void;
  deleteTodos: (id: string, state: TaskVariant) => void;
  editTodo: (taskId: string, newTitle: string) => void;
  moveTaskBetweenCategories: (
    taskId: string,
    sourceCategory: string,
    targetCategory: string,
    targetIndex: number,
  ) => void;
};
// Define the store
const useTodos = create<TodoStore>()(
  persist(
    (set) => ({
      todos: {
        planned: [],
        ongoing: [],
        done: [],
      },
      counter: 1,
      resetCounter: (counter) => set({ counter }),
      setCounter: (id, newOrder) => {
        set((store) => {
          const { todos } = store;
          for (const category in todos) {
            const tasks = todos[category];
            const taskToEdit = tasks.find((task) => task.id === id);

            // If the task is found, update its title and break out of the loop
            if (taskToEdit) {
              taskToEdit.order = newOrder;
              break;
            }
          }

          return { todos: { ...todos } };
        });
      },
      addTodos: (title, state) => {
        set((prev) => {
          const newTask = { title, state, id: nanoid(), order: prev.counter++ };
          return {
            todos: {
              ...prev.todos,
              [state]: [...prev.todos[state as keyof Todos], newTask],
            },
          };
        });
      },
      deleteTodos: (id, state) => {
        set((prev) => {
          return {
            todos: {
              ...prev.todos,
              [state]: prev.todos[state].filter((task) => task.id !== id),
            },
          };
        });
      },
      editTodo: (taskId: string, newTitle: string) => {
        set((store) => {
          const { todos } = store;
          for (const category in todos) {
            const tasks = todos[category];
            const taskToEdit = tasks.find((task) => task.id === taskId);

            // If the task is found, update its title and break out of the loop
            if (taskToEdit) {
              taskToEdit.title = newTitle;
              break;
            }
          }

          return { todos: { ...todos } };
        });
      },
      moveTaskBetweenCategories: (
        taskId: string,
        sourceCategory: string,
        targetCategory: string,
        targetIndex: number,
      ) =>
        set((store: TodoStore) => {
          const { todos } = store;
          const sourceTasks = todos[sourceCategory];
          const targetTasks = todos[targetCategory];

          const taskToMoveIndex = sourceTasks.findIndex(
            (task) => task.id === taskId,
          );

          if (
            taskToMoveIndex === -1 ||
            targetIndex < 0 ||
            targetIndex > targetTasks.length
          ) {
            // Invalid indices or categories, do nothing
            return store; // Return the original store to avoid the error
          }

          const taskToMove = sourceTasks.splice(taskToMoveIndex, 1)[0];
          targetTasks.splice(targetIndex, 0, {
            ...taskToMove,
            state: targetCategory,
          });

          return { todos: { ...todos } };
        }),
    }),
    { name: "to-doooo" },
  ),
);

export { useTodos };
