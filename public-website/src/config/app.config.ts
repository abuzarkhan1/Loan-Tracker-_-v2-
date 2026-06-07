export const APP_CONFIG = {
  appName: "Loan Tracker",
  apiBaseUrl: import.meta.env.VITE_API_URL || "http://localhost:5050/api",

  apkDownloadUrl:
    "https://github.com/abuzarkhan1/Loan-Tracker-_-v2-/releases/download/V1/application-81de37a1-1293-47db-8c51-64e8cd940478.apk",

  apkVersion: "V1",
  apkSize: "102 MB",
  lastUpdated: "June 7, 2026",

  androidCompatibility: "Android APK",
  supportEmail: "support@example.com",
  supportEmailHref: "mailto:support@example.com",
  contactPhone: "Coming soon",
  companyLocation: "Pakistan",
} as const;