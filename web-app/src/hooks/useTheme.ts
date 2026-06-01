import { useThemeStore } from "../store/theme.store";
import { themes } from "../config/theme.config";

export const useTheme = () => {
  const { mode, setMode, toggleMode } = useThemeStore();
  
  return {
    mode,
    theme: themes[mode],
    isDark: mode === "dark",
    setMode,
    toggleMode,
  };
};

export default useTheme;
