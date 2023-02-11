import React, { useEffect, useState } from 'react';

// library import
import { CheckIcon } from '@heroicons/react/24/solid';

export default function EditForm({ editedTask, updateTask, closeEditMode }) {
  const [updatedTaskName, setUpdatedTaskName] = useState(editedTask.name);

  useEffect(() => {
    const closeModalIfEscaped = e => {
      e.key === 'Escape' && closeEditMode();
    };
    window.addEventListener('keydown', closeModalIfEscaped);

    return () => {
      window.removeEventListener('keydown', closeModalIfEscaped);
    };
  }, [closeEditMode]);

  const handleForm = e => {
    e.preventDefault();
    updateTask({ ...editedTask, name: updatedTaskName });
  };
  return (
    <div
      role="dialog"
      aria-labelledby="editTask"
      onClick={e => {
        e.target === e.currentTarget && closeEditMode(); // keluar dari kotak (close edit)
      }}
    >
      <form className="todo" onSubmit={handleForm}>
        <div className="wrapper">
          <input
            type="text"
            id="editTask"
            className="input"
            value={updatedTaskName}
            onInput={e => setUpdatedTaskName(e.target.value)}
            required
            autoFocus
            maxLength={60}
            placeholder="Update Task"
          />
          <label htmlFor="ediTask" className="label">
            Edit Task
          </label>
        </div>
        <button
          className="btn"
          aria-label={`Confirm edited task to no read ${updatedTaskName}`}
          type="submit"
        >
          <CheckIcon strokeWidth={2} height={24} width={24} />
        </button>
      </form>
    </div>
  );
}
