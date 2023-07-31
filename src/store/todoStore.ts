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
  editTodo: (taskId: string, newTitle: string) => void;
  moveTaskBetweenCategories: (
    taskId: string,
    sourceCategory: string,
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
      editTodo: (taskId: string, newTitle: string) => {
        set(store => {
          const { todos } = store;
          for (const category in todos) {
            const tasks = todos[category];
            const taskToEdit = tasks.find(task => task.id === taskId);

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
        targetIndex: number
      ) =>
        set((store: Store) => {
          const { todos } = store;
          const sourceTasks = todos[sourceCategory];
          const targetTasks = todos[targetCategory];

          const taskToMoveIndex = sourceTasks.findIndex(
            task => task.id === taskId
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
    { name: 'to-doooo' }
  )
);

export default useTodos;
