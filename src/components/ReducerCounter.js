import React, { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      throw new Error();
  }
}

const ReducerCounter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleIncrement = () => {
    dispatch({ type: 'increment' });
  };

  const handleDecrement = () => {
    dispatch({ type: 'decrement' });
  };

  const handleReset = () => {
    dispatch({ type: 'reset' });
  };
  
  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter') {
      dispatch(action);
    }
  };

  return (
    <div className="p-5 border rounded-lg shadow-md bg-white text-gray-800">
      <h2 aria-live="polite" className="text-2xl font-bold mb-4">Счетчик: {state.count}</h2>
      <div className="flex justify-center gap-2 mt-2">
        <button 
          onClick={handleIncrement} 
          onKeyDown={(e) => handleKeyDown(e, { type: 'increment' })}
          aria-label="Увеличить счетчик"
          className="px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
          +
        </button>
        <button 
          onClick={handleDecrement} 
          onKeyDown={(e) => handleKeyDown(e, { type: 'decrement' })}
          aria-label="Уменьшить счетчик"
          className="px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
          -
        </button>
        <button 
          onClick={handleReset} 
          onKeyDown={(e) => handleKeyDown(e, { type: 'reset' })}
          aria-label="Сбросить счетчик"
          className="px-4 py-2 text-base font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
          >
          Сброс
        </button>
      </div>
    </div>
  );
};

export default ReducerCounter; 