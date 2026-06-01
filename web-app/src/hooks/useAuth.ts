import { useAuthStore } from "../store/auth.store";

export const useAuth = () => {
  const { user, token, isBootstrapping, login, register, updateProfile, logout } = useAuthStore();
  
  return {
    user,
    token,
    isBootstrapping,
    isAuthenticated: !!token,
    login,
    register,
    updateProfile,
    logout,
  };
};

export default useAuth;
