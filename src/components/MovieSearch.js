import React, { useState } from 'react';

const MovieSearch = () => {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [plotType, setPlotType] = useState('short');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = '8f35eee2';

  const handleSearch = async () => {
    if (!query) {
      setError('Пожалуйста, введите название фильма.');
      return;
    }

    setLoading(true);
    setError('');
    setMovie(null);

    try {
      let apiUrl = `https://www.omdbapi.com/?t=${query}&plot=${plotType}&apikey=${API_KEY}`;
      if (year) {
        apiUrl += `&y=${year}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovie(data);
      } else {
        setError(data.Error);
      }
    } catch (err) {
      setError('Произошла ошибка при загрузке данных. Попробуйте еще раз.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-center text-yellow-400">Поиск фильмов</h1>
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8 items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите название фильма..."
            aria-label="Название фильма"
            className="flex-grow bg-gray-800 text-white placeholder-gray-500 border-2 border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Год"
            aria-label="Год выпуска"
            className="w-full sm:w-28 bg-gray-800 text-white placeholder-gray-500 border-2 border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
          <select
            value={plotType}
            onChange={(e) => setPlotType(e.target.value)}
            aria-label="Тип описания"
            className="w-full sm:w-auto bg-gray-800 text-white border-2 border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          >
            <option value="short">Короткое описание</option>
            <option value="full">Полное описание</option>
          </select>
          <button
            onClick={handleSearch}
            disabled={loading}
            aria-label="Найти фильм"
            className="bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : 'Поиск'}
          </button>
        </div>

        {error && <p className="text-red-500 text-center text-lg">{error}</p>}
        
        {movie && (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-8">
              {movie.Poster && movie.Poster !== 'N/A' && (
                <div className="flex-shrink-0 w-full sm:w-48">
                  <img 
                    src={movie.Poster} 
                    alt={`Постер фильма ${movie.Title}`} 
                    className="rounded-lg w-full h-auto shadow-lg"
                  />
                </div>
              )}
              <div className="flex-grow">
                <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4">{movie.Title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <p><span className="font-semibold text-gray-400">Год:</span> {movie.Year}</p>
                  <p><span className="font-semibold text-gray-400">Рейтинг:</span> {movie.imdbRating}</p>
                  <p><span className="font-semibold text-gray-400">Длительность:</span> {movie.Runtime}</p>
                  <p><span className="font-semibold text-gray-400">Режиссер:</span> {movie.Director}</p>
                  <div className="col-span-1 md:col-span-2">
                    <p><span className="font-semibold text-gray-400">Актерский состав:</span> {movie.Actors}</p>
                  </div>
                </div>
                {movie.Plot && movie.Plot !== 'N/A' && (
                  <div className="mt-6">
                    <p className="font-semibold text-gray-400 mb-1">Описание:</p>
                    <p>{movie.Plot}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieSearch; 