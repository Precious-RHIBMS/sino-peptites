import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import {
  loginCustomer,
  logoutCustomer,
  mapAuthError,
  refreshCurrentUser,
  registerCustomer,
  requestPasswordReset,
  resendVerificationEmail,
} from '../services/authService';
import {
  getCustomerProfile,
  getPublicWebsiteSettings,
  getUserPreferences,
  saveUserPreferences,
  submitSupportMessage,
  subscribeToUserSupportMessages,
  updateCustomerProfile,
} from '../services/firestoreService';
import {
  CookieConsentValue,
  CustomerProfile,
  SupportMessage,
  UserPreferences,
  WebsiteSettings,
} from '../types';

function formatContextError(err: unknown): string {
  if (err instanceof Error) {
    try {
      const parsed = JSON.parse(err.message) as { error?: string };
      if (parsed && typeof parsed.error === 'string') {
        return parsed.error;
      }
    } catch {
      // Not a JSON-serialized FirestoreErrorInfo payload
    }
  }
  return mapAuthError(err);
}

interface AuthContextValue {
  user: User | null;
  profile: CustomerProfile | null;
  preferences: UserPreferences | null;
  websiteSettings: WebsiteSettings | null;
  supportMessages: SupportMessage[];
  authReady: boolean;
  isBusy: boolean;
  error: string | null;
  clearError: () => void;
  register: (params: {
    email: string;
    password: string;
    displayName: string;
    preferredCountry: string;
  }) => Promise<boolean>;
  login: (params: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  resendVerification: () => Promise<boolean>;
  refreshVerification: () => Promise<boolean>;
  saveProfile: (updates: {
    displayName?: string;
    phone?: string;
    preferredCountry?: string;
  }) => Promise<boolean>;
  savePreferences: (prefs: {
    preferredCountry: string;
    emailNotifications: boolean;
    whatsappUpdates: boolean;
    cookieConsent: CookieConsentValue;
  }) => Promise<boolean>;
  sendSupportMessage: (params: { subject: string; message: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings | null>(null);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Load optional public website settings once on mount
  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;
    let active = true;
    getPublicWebsiteSettings()
      .then((settings) => {
        if (active && settings) {
          setWebsiteSettings(settings);
        }
      })
      .catch(() => {
        // Storefront falls back gracefully to local STORE_CONFIG if /settings/public isn't seeded
      });
    return () => {
      active = false;
    };
  }, []);

  // Persistent Firebase Authentication state listener
  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setAuthReady(true);
      return undefined;
    }

    let unsubscribeMessages: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeMessages) {
        unsubscribeMessages();
        unsubscribeMessages = null;
      }

      setUser(firebaseUser);

      if (!firebaseUser) {
        setProfile(null);
        setPreferences(null);
        setSupportMessages([]);
        setAuthReady(true);
        return;
      }

      try {
        const [loadedProfile, loadedPrefs] = await Promise.all([
          getCustomerProfile(firebaseUser.uid).catch(() => null),
          getUserPreferences(firebaseUser.uid).catch(() => null),
        ]);
        setProfile(loadedProfile);
        setPreferences(loadedPrefs);

        unsubscribeMessages = subscribeToUserSupportMessages(firebaseUser.uid, (msgs) => {
          setSupportMessages(msgs);
        });
      } catch (err) {
        console.warn('Could not load user Firestore records:', err);
      } finally {
        setAuthReady(true);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeMessages) {
        unsubscribeMessages();
      }
    };
  }, []);

  const register = useCallback(
    async (params: {
      email: string;
      password: string;
      displayName: string;
      preferredCountry: string;
    }) => {
      setIsBusy(true);
      setError(null);
      try {
        const created = await registerCustomer(params);
        const loaded = await getCustomerProfile(created.uid).catch(() => null);
        setProfile(loaded);
        return true;
      } catch (err) {
        setError(formatContextError(err));
        return false;
      } finally {
        setIsBusy(false);
      }
    },
    []
  );

  const login = useCallback(async (params: { email: string; password: string }) => {
    setIsBusy(true);
    setError(null);
    try {
      const signedIn = await loginCustomer(params);
      const [loadedProfile, loadedPrefs] = await Promise.all([
        getCustomerProfile(signedIn.uid).catch(() => null),
        getUserPreferences(signedIn.uid).catch(() => null),
      ]);
      setProfile(loadedProfile);
      setPreferences(loadedPrefs);
      return true;
    } catch (err) {
      setError(formatContextError(err));
      return false;
    } finally {
      setIsBusy(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsBusy(true);
    setError(null);
    try {
      await logoutCustomer();
    } catch (err) {
      setError(formatContextError(err));
    } finally {
      setIsBusy(false);
    }
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    setIsBusy(true);
    setError(null);
    try {
      await requestPasswordReset(email);
      return true;
    } catch (err) {
      setError(formatContextError(err));
      return false;
    } finally {
      setIsBusy(false);
    }
  }, []);

  const resendVerification = useCallback(async () => {
    setIsBusy(true);
    setError(null);
    try {
      await resendVerificationEmail();
      return true;
    } catch (err) {
      setError(formatContextError(err));
      return false;
    } finally {
      setIsBusy(false);
    }
  }, []);

  const refreshVerification = useCallback(async () => {
    setIsBusy(true);
    setError(null);
    try {
      const updated = await refreshCurrentUser();
      setUser(updated ? ({ ...updated } as User) : null);
      if (updated) {
        const loadedProfile = await getCustomerProfile(updated.uid).catch(() => null);
        setProfile(loadedProfile);
      }
      return Boolean(updated?.emailVerified);
    } catch (err) {
      setError(formatContextError(err));
      return false;
    } finally {
      setIsBusy(false);
    }
  }, []);

  const saveProfile = useCallback(
    async (updates: { displayName?: string; phone?: string; preferredCountry?: string }) => {
      if (!user) return false;
      setIsBusy(true);
      setError(null);
      try {
        await updateCustomerProfile(user.uid, updates);
        const refreshed = await getCustomerProfile(user.uid).catch(() => null);
        setProfile(refreshed);
        return true;
      } catch (err) {
        setError(formatContextError(err));
        return false;
      } finally {
        setIsBusy(false);
      }
    },
    [user]
  );

  const savePreferences = useCallback(
    async (prefs: {
      preferredCountry: string;
      emailNotifications: boolean;
      whatsappUpdates: boolean;
      cookieConsent: CookieConsentValue;
    }) => {
      if (!user) return false;
      if (!user.emailVerified) {
        setError('Please verify your email address before saving synced account preferences.');
        return false;
      }
      setIsBusy(true);
      setError(null);
      try {
        await saveUserPreferences(user.uid, prefs);
        const refreshed = await getUserPreferences(user.uid).catch(() => null);
        setPreferences(refreshed);
        return true;
      } catch (err) {
        setError(formatContextError(err));
        return false;
      } finally {
        setIsBusy(false);
      }
    },
    [user]
  );

  const sendSupportMessage = useCallback(
    async (params: { subject: string; message: string }) => {
      if (!user) return false;
      if (!user.emailVerified) {
        setError('Please verify your email address before submitting a support ticket.');
        return false;
      }
      setIsBusy(true);
      setError(null);
      try {
        await submitSupportMessage({
          userId: user.uid,
          senderName: profile?.displayName || user.displayName || 'Customer',
          senderEmail: user.email || profile?.email || '',
          subject: params.subject,
          message: params.message,
        });
        return true;
      } catch (err) {
        setError(formatContextError(err));
        return false;
      } finally {
        setIsBusy(false);
      }
    },
    [user, profile]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      preferences,
      websiteSettings,
      supportMessages,
      authReady,
      isBusy,
      error,
      clearError,
      register,
      login,
      logout,
      sendPasswordReset,
      resendVerification,
      refreshVerification,
      saveProfile,
      savePreferences,
      sendSupportMessage,
    }),
    [
      user,
      profile,
      preferences,
      websiteSettings,
      supportMessages,
      authReady,
      isBusy,
      error,
      clearError,
      register,
      login,
      logout,
      sendPasswordReset,
      resendVerification,
      refreshVerification,
      saveProfile,
      savePreferences,
      sendSupportMessage,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return ctx;
}
