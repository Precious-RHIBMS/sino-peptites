import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
import { Firestore, doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';

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

/**
 * Centralized Firebase configuration prioritizing VITE_FIREBASE_* environment
 * variables with provisioned firebase-applet-config.json defaults.
 */
const firebaseConfig: FirebaseWebConfig = {
  apiKey: readEnv('VITE_FIREBASE_API_KEY') || firebaseAppletConfig.apiKey,
  authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN') || firebaseAppletConfig.authDomain,
  projectId: readEnv('VITE_FIREBASE_PROJECT_ID') || firebaseAppletConfig.projectId,
  storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET') || firebaseAppletConfig.storageBucket,
  messagingSenderId:
    readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || firebaseAppletConfig.messagingSenderId,
  appId: readEnv('VITE_FIREBASE_APP_ID') || firebaseAppletConfig.appId,
  firestoreDatabaseId:
    readEnv('VITE_FIREBASE_FIRESTORE_DATABASE_ID') ||
    firebaseAppletConfig.firestoreDatabaseId,
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
  initializedDb =
    dbId && dbId !== '(default)'
      ? getFirestore(initializedApp, dbId)
      : getFirestore(initializedApp);
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
