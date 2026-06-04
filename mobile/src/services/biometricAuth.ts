import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

const BIOMETRIC_LOGIN_KEY = "loan-tracker-biometric-login";
const KEYCHAIN_SERVICE = "loan-tracker-quick-login";

export type BiometricAvailability = {
  hasHardware: boolean;
  isEnrolled: boolean;
  canUseBiometric: boolean;
  label: string;
};

export type SavedBiometricCredentials = {
  email: string;
  password: string;
  savedAt: string;
};

const secureStoreOptions: SecureStore.SecureStoreOptions = {
  keychainService: KEYCHAIN_SERVICE,
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

const biometricLabel = (types: LocalAuthentication.AuthenticationType[]) => {
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) return "Face ID";
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) return "Fingerprint";
  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) return "Biometric";
  return "Biometric";
};

export const getBiometricAvailability = async (): Promise<BiometricAvailability> => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const types = hasHardware ? await LocalAuthentication.supportedAuthenticationTypesAsync() : [];
  const isEnrolled = hasHardware ? await LocalAuthentication.isEnrolledAsync() : false;

  return {
    hasHardware,
    isEnrolled,
    canUseBiometric: hasHardware && isEnrolled,
    label: biometricLabel(types),
  };
};

export const saveBiometricCredentials = async (payload: { email: string; password: string }) => {
  const isSecureStoreAvailable = await SecureStore.isAvailableAsync();
  if (!isSecureStoreAvailable) return;

  const credentials: SavedBiometricCredentials = {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    savedAt: new Date().toISOString(),
  };

  await SecureStore.setItemAsync(BIOMETRIC_LOGIN_KEY, JSON.stringify(credentials), secureStoreOptions);
};

export const getSavedBiometricCredentials = async () => {
  const isSecureStoreAvailable = await SecureStore.isAvailableAsync();
  if (!isSecureStoreAvailable) return null;

  const raw = await SecureStore.getItemAsync(BIOMETRIC_LOGIN_KEY, secureStoreOptions);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SavedBiometricCredentials;
  } catch {
    await SecureStore.deleteItemAsync(BIOMETRIC_LOGIN_KEY, secureStoreOptions);
    return null;
  }
};

export const clearBiometricCredentials = async () => {
  const isSecureStoreAvailable = await SecureStore.isAvailableAsync();
  if (!isSecureStoreAvailable) return;
  await SecureStore.deleteItemAsync(BIOMETRIC_LOGIN_KEY, secureStoreOptions);
};

export const authenticateAndGetSavedCredentials = async () => {
  const availability = await getBiometricAvailability();
  if (!availability.canUseBiometric) {
    throw new Error("Biometric login is not available on this device.");
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: `Login to Loan Tracker`,
    promptSubtitle: `Use ${availability.label} for quick login`,
    cancelLabel: "Cancel",
    fallbackLabel: "Use passcode",
    disableDeviceFallback: false,
    biometricsSecurityLevel: "weak",
  });

  if (!result.success) return null;

  const credentials = await getSavedBiometricCredentials();
  if (!credentials) {
    throw new Error("No saved biometric login found. Login once with email and password.");
  }

  return credentials;
};
