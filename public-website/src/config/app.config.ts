export const APP_CONFIG = {
  appName: "Loan Tracker",
  apiBaseUrl: import.meta.env.VITE_API_URL || "http://localhost:5050/api",

  apkDownloadUrl:
    "https://github.com/abuzarkhan1/Loan-Tracker-_-v2-/releases/download/V1/application-0c8ac9e8-6b81-469a-acd8-059bc7ba80b3.apk",

  apkVersion: "V1",
  apkSize: "102 MB",
  lastUpdated: "June 7, 2026",

  androidCompatibility: "Android APK",
  supportEmail: "support@example.com",
  supportEmailHref: "mailto:support@example.com",
  contactPhone: "Coming soon",
  companyLocation: "Pakistan",
} as const;
