import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
import {
  Firestore,
  doc,
  getDocFromServer,
  getFirestore,
  initializeFirestore,
} from 'firebase/firestore';

interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  firestoreDatabaseId?: string;
}

function readEnv(key: string): string {
  const value = import.meta.env[key];
  return typeof value === 'string' ? value.trim() : '';
}

const defaultFirebaseConfig: FirebaseWebConfig = {
  apiKey: 'AIzaSyAAfVAJq6rWMyWn3DiUoyoZX1rjN0QgF4M',
  authDomain: 'gen-lang-client-0556039399.firebaseapp.com',
  projectId: 'gen-lang-client-0556039399',
  storageBucket: 'gen-lang-client-0556039399.firebasestorage.app',
  messagingSenderId: '1095755259090',
  appId: '1:1095755259090:web:a844125a0c13684570210b',
  firestoreDatabaseId: '(default)',
};

/**
 * Centralized Firebase configuration prioritizing VITE_FIREBASE_* environment
 * variables with the user-provided gen-lang-client-0556039399 defaults.
 */
const firebaseConfig: FirebaseWebConfig = {
  apiKey: readEnv('VITE_FIREBASE_API_KEY') || defaultFirebaseConfig.apiKey,
  authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN') || defaultFirebaseConfig.authDomain,
  projectId: readEnv('VITE_FIREBASE_PROJECT_ID') || defaultFirebaseConfig.projectId,
  storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET') || defaultFirebaseConfig.storageBucket,
  messagingSenderId:
    readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || defaultFirebaseConfig.messagingSenderId,
  appId: readEnv('VITE_FIREBASE_APP_ID') || defaultFirebaseConfig.appId,
  firestoreDatabaseId:
    readEnv('VITE_FIREBASE_FIRESTORE_DATABASE_ID') ||
    defaultFirebaseConfig.firestoreDatabaseId,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

export const configuredProjectId = firebaseConfig.projectId || null;

let initializedApp: FirebaseApp | null = null;
let initializedAuth: Auth | null = null;
let initializedDb: Firestore | null = null;

if (isFirebaseConfigured) {
  initializedApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  initializedAuth = getAuth(initializedApp);

  // Enforce persistent browser authentication sessions across refreshes and tabs
  setPersistence(initializedAuth, browserLocalPersistence).catch((err) => {
    console.warn('Unable to configure local auth persistence:', err);
  });

  const dbId = firebaseConfig.firestoreDatabaseId;
  const customDbId = dbId && dbId !== '(default)' ? dbId : null;
  try {
    // Use long-polling so proxied/iframe browser environments don't drop WebChannel and report offline
    initializedDb = customDbId
      ? initializeFirestore(initializedApp, { experimentalForceLongPolling: true }, customDbId)
      : initializeFirestore(initializedApp, { experimentalForceLongPolling: true });
  } catch {
    initializedDb = customDbId
      ? getFirestore(initializedApp, customDbId)
      : getFirestore(initializedApp);
  }
}

export const firebaseApp: FirebaseApp | null = initializedApp;
export const auth: Auth | null = initializedAuth;
export const db: Firestore | null = initializedDb;

/**
 * Validates initial Firestore server connectivity on application boot when configured.
 */
export async function testFirestoreConnection(): Promise<void> {
  if (!initializedDb) return;
  try {
    await getDocFromServer(doc(initializedDb, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration: Firestore client is offline.');
    }
  }
}

void testFirestoreConnection();
