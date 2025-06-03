
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const NotFound = () => {
  const location = useLocation();
  const { currentTheme } = useTheme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const getThemeClass = () => {
    if (currentTheme !== 'default') {
      return `theme-${currentTheme} theme-responsive-bg`;
    }
    return "bg-gray-100 dark:bg-gray-800";
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${getThemeClass()}`}>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 theme-text-primary">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 theme-text-secondary mb-4">
          Oops! Page not found
        </p>
        <a 
          href="/" 
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline theme-text-primary"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
