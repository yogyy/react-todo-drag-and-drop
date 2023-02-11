import React, { useEffect, useRef, useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import useLocalStorage from '../hooks/useLocalStorage';

const EditableTitle = () => {
  const [title, setTitle] = useLocalStorage('title', 'My Task Lists');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const handleChange = event => {
    setTitle(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    setIsEditing(false);
  };
  useEffect(() => {
    const handleClickOutside = event => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsEditing(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [inputRef]);
  return (
    <>
      <div className="titlecontainer" ref={inputRef}>
        {isEditing ? (
          <form className="todo" onSubmit={handleSubmit}>
            <div className="wrapper">
              <input
                id="task"
                type="text"
                className="inputtitle"
                required
                autoFocus
                maxLength={60}
                onChange={handleChange}
              />
            </div>
          </form>
        ) : (
          <h1>{title}</h1>
        )}
        <button
          style={{ boxShadow: 'none' }}
          className={`btn`}
          onClick={() => setIsEditing(true)}
        >
          <PencilSquareIcon width={24} height={24} />
        </button>
      </div>
    </>
  );
};

export default EditableTitle;
