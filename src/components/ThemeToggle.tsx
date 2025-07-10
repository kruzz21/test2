import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'button', 
  size = 'default',
  showLabel = false 
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  const getThemeIcon = (themeName: string, isResolved = false) => {
    const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
    
    switch (themeName) {
      case 'light':
        return <Sun className={iconSize} />;
      case 'dark':
        return <Moon className={iconSize} />;
      case 'system':
        return <Monitor className={iconSize} />;
      default:
        return <Palette className={iconSize} />;
    }
  };

  const getThemeLabel = (themeName: string) => {
    switch (themeName) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'Theme';
    }
  };

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size={size}
            className="theme-toggle-button"
            aria-label="Toggle theme"
          >
            {getThemeIcon(resolvedTheme)}
            {showLabel && (
              <span className="ml-2">
                {getThemeLabel(theme)}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="theme-dropdown">
          <DropdownMenuItem 
            onClick={() => setTheme('light')}
            className={theme === 'light' ? 'bg-accent' : ''}
          >
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme('dark')}
            className={theme === 'dark' ? 'bg-accent' : ''}
          >
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme('system')}
            className={theme === 'system' ? 'bg-accent' : ''}
          >
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleTheme}
      className="theme-toggle-button"
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      {getThemeIcon(resolvedTheme)}
      {showLabel && (
        <span className="ml-2">
          {getThemeLabel(resolvedTheme)}
        </span>
      )}
    </Button>
  );
};

export default ThemeToggle;