export const APP_CONFIG = {
  appName: import.meta.env.VITE_APP_NAME || "Loan Tracker",
  apiUrl: import.meta.env.VITE_API_URL || "https://tracker.marenax.site/api",
  localStorageKeys: {
    token: "loan-tracker-token",
    user: "loan-tracker-user",
    theme: "loan-tracker-theme",
  },
};
