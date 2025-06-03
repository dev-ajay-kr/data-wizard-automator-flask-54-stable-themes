
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

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
      return `theme-${currentTheme}`;
    }
    return "";
  };

  return (
    <div className={`min-h-[80vh] flex items-center justify-center w-full ${getThemeClass()}`}>
      <div className="text-center p-8 rounded-lg max-w-md theme-card">
        <h1 className="text-6xl font-bold mb-4 theme-text-primary">404</h1>
        <p className="text-xl mb-8 theme-text-secondary">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button 
          variant="default" 
          onClick={() => window.location.href = '/'}
          className="theme-button-primary flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
