import { useState, useEffect } from 'react';
import api, { setCsrfToken } from './api';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setToken] = useState('');

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const { data } = await api.get('/csrf-token');
        setToken(data.csrfToken);
        setCsrfToken(data.csrfToken); // Set token for subsequent requests
      } catch (err) {
        console.error('Failed to fetch CSRF token', err);
        setError('Could not initialize session. Please refresh the page.');
      }
    };
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse('');

    if (!message) {
      setError('Please enter a message.');
      return;
    }

    try {
      const { data } = await api.post('/submit', { message });
      setResponse(data.message);
      setMessage('');
    } catch (err) {
      console.error('Submission failed', err);
      setError(err.response?.data || 'An error occurred during submission.');
    }
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">CSRF Protected Form</h1>
        
        <p className="text-sm text-gray-600">
          Your CSRF Token: 
          <span className="block w-full p-2 mt-1 font-mono text-xs text-green-700 bg-green-50 rounded break-all">
            {csrfToken || 'Fetching...'}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Enter a message:
            </label>
            <input
              type="text"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Hello, secure world!"
              disabled={!csrfToken}
            />
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            disabled={!csrfToken}
          >
            Submit Securely
          </button>
        </form>

        {response && (
          <div className="p-4 mt-4 text-center text-green-800 bg-green-100 border border-green-200 rounded-md">
            <p className="font-semibold">Server Response:</p>
            <p>{response}</p>
          </div>
        )}

        {error && (
          <div className="p-4 mt-4 text-center text-red-800 bg-red-100 border border-red-200 rounded-md">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
