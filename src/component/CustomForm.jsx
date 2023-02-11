import React, { useState } from 'react';

// library import
import { DocumentPlusIcon } from '@heroicons/react/24/solid';

export default function CustomForm({ addTask }) {
  const [task, setTask] = useState('');

  const handleForm = e => {
    e.preventDefault();
    addTask({
      name: task,
      checked: false,
      id: Date.now(),
    });
    setTask('');
  };
  return (
    <form className="todo" onSubmit={handleForm}>
      <div className="wrapper">
        <input
          type="text"
          id="task"
          className="input"
          value={task}
          onInput={e => setTask(e.target.value)}
          required
          maxLength={60}
          placeholder="Enter Task"
        />
        <label htmlFor="task" className="label">
          Enter Task
        </label>
      </div>
      <button className="btn" aria-label="Add Task " type="submit">
        <DocumentPlusIcon />
      </button>
    </form>
  );
}
