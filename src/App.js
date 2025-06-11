import ThemeSwitcher from './components/ThemeSwitcher';
import './App.css';

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="absolute top-4 right-100">
        <ThemeSwitcher />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
          Привет, Tailwind!
        </h1>
        <p className="mt-4 text-lg">
          Нажмите на иконку выше, чтобы переключить светлую и темную тему.
        </p>
      </div>
    </div>
  );
}

export default App;
