import { useState } from 'react';
import './App.css';
import CustomForm from './component/CustomForm';
import EditForm from './component/EditForm';
import { TaskList } from './component/TaskList';
import useLocalStorage from './hooks/useLocalStorage';
import ParticlesComponent from './component/Particle';
import EditableTitle from './component/Title';

function App() {
  const [tasks, setTasks] = useLocalStorage('react-todo.tasks', []);
  const [prevFocusEl, setPrevFocusEl] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const addTask = task => {
    setTasks(prevState => [...prevState, task]);
  };
  const deleteTask = id => {
    setTasks(prevState => prevState.filter(t => t.id !== id));
  };
  const toggleTask = id => {
    setTasks(prevState =>
      prevState.map(t => (t.id === id ? { ...t, checked: !t.checked } : t))
    );
  };
  const updateTask = task => {
    setTasks(prevState =>
      prevState.map(t => (t.id === task.id ? { ...t, name: task.name } : t))
    );
    closeEditMode();
  };

  const closeEditMode = () => {
    setIsEditing(false);
    prevFocusEl.focus();
  };

  const enterEditMode = task => {
    setEditedTask(task);
    setIsEditing(true);
    setPrevFocusEl(document.activeElement);
  };

  return (
    <div className="">
      <div className="container">
        <ParticlesComponent id="tsparticles" />
        <header>
          <EditableTitle />
        </header>
        {isEditing && (
          <EditForm
            editedTask={editedTask}
            updateTask={updateTask}
            closeEditMode={closeEditMode}
          />
        )}
        <CustomForm addTask={addTask} />
        {tasks && (
          <TaskList
            tasks={tasks}
            deleteTask={deleteTask}
            toggleTask={toggleTask}
            enterEditMode={enterEditMode}
          />
        )}
      </div>
    </div>
  );
}

export default App;
