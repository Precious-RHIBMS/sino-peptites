import {
  Firestore,
  Unsubscribe,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OperationType, handleFirestoreError } from '../lib/firestoreErrors';
import {
  CookieConsentValue,
  CustomerProfile,
  SupportMessage,
  UserPreferences,
  WebsiteSettings,
} from '../types';

export const ADMIN_OWNER_EMAIL = 'embenohp@gmail.com';

const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

function sanitizeText(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

function assertValidId(id: string, label: string): string {
  const trimmed = id.trim();
  if (!trimmed || trimmed.length > 128 || !SAFE_ID_REGEX.test(trimmed)) {
    throw new Error(`Invalid ${label} identifier.`);
  }
  return trimmed;
}

function createSafeMessageId(): string {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `msg_${Date.now()}_${suffix}`;
}

function requireDb(): Firestore {
  if (!db) {
    throw new Error(
      'Firestore is not configured yet. Please check your Firebase configuration.'
    );
  }
  return db;
}

export async function getCustomerProfile(uid: string): Promise<CustomerProfile | null> {
  const safeUid = assertValidId(uid, 'user');
  const path = `users/${safeUid}`;
  try {
    const snap = await getDoc(doc(requireDb(), 'users', safeUid));
    return snap.exists() ? (snap.data() as CustomerProfile) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function createInitialCustomerProfile(params: {
  uid: string;
  email: string;
  displayName: string;
  preferredCountry: string;
  emailVerified: boolean;
}): Promise<void> {
  const safeUid = assertValidId(params.uid, 'user');
  const path = `users/${safeUid}`;
  const cleanName = sanitizeText(params.displayName, 100) || params.email.split('@')[0] || 'Customer';
  const cleanCountry = sanitizeText(params.preferredCountry, 80);
  const validCountry = cleanCountry.length >= 2 ? cleanCountry : 'United States';

  const payload = {
    uid: safeUid,
    displayName: cleanName,
    email: sanitizeText(params.email, 254),
    phone: '',
    preferredCountry: validCountry,
    emailVerified: Boolean(params.emailVerified),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(requireDb(), 'users', safeUid), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateCustomerProfile(
  uid: string,
  updates: {
    displayName?: string;
    phone?: string;
    preferredCountry?: string;
    emailVerified?: boolean;
  }
): Promise<void> {
  const safeUid = assertValidId(uid, 'user');
  const path = `users/${safeUid}`;
  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (updates.displayName !== undefined) {
    const cleanName = sanitizeText(updates.displayName, 100);
    if (cleanName.length >= 1) payload.displayName = cleanName;
  }
  if (updates.phone !== undefined) {
    payload.phone = sanitizeText(updates.phone, 30);
  }
  if (updates.preferredCountry !== undefined) {
    const cleanCountry = sanitizeText(updates.preferredCountry, 80);
    if (cleanCountry.length >= 2) payload.preferredCountry = cleanCountry;
  }
  if (updates.emailVerified !== undefined) {
    payload.emailVerified = Boolean(updates.emailVerified);
  }

  try {
    await updateDoc(doc(requireDb(), 'users', safeUid), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function getUserPreferences(uid: string): Promise<UserPreferences | null> {
  const safeUid = assertValidId(uid, 'user');
  const path = `userPreferences/${safeUid}`;
  try {
    const snap = await getDoc(doc(requireDb(), 'userPreferences', safeUid));
    return snap.exists() ? (snap.data() as UserPreferences) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveUserPreferences(
  uid: string,
  prefs: {
    preferredCountry: string;
    emailNotifications: boolean;
    whatsappUpdates: boolean;
    cookieConsent: CookieConsentValue;
  }
): Promise<void> {
  const safeUid = assertValidId(uid, 'user');
  const path = `userPreferences/${safeUid}`;
  const cleanCountry = sanitizeText(prefs.preferredCountry, 80);
  const validCountry = cleanCountry.length >= 2 ? cleanCountry : 'United States';
  const validConsent: CookieConsentValue =
    prefs.cookieConsent === 'accepted' || prefs.cookieConsent === 'dismissed'
      ? prefs.cookieConsent
      : 'unset';

  const payload = {
    userId: safeUid,
    preferredCountry: validCountry,
    emailNotifications: Boolean(prefs.emailNotifications),
    whatsappUpdates: Boolean(prefs.whatsappUpdates),
    cookieConsent: validConsent,
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(requireDb(), 'userPreferences', safeUid), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getPublicWebsiteSettings(): Promise<WebsiteSettings | null> {
  const path = 'settings/public';
  try {
    const snap = await getDoc(doc(requireDb(), 'settings', 'public'));
    return snap.exists() ? (snap.data() as WebsiteSettings) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function submitSupportMessage(params: {
  userId: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}): Promise<string> {
  const safeUid = assertValidId(params.userId, 'user');
  const messageId = createSafeMessageId();
  const path = `supportMessages/${messageId}`;

  const cleanSubject = sanitizeText(params.subject, 160);
  const cleanMessage = sanitizeText(params.message, 2000);
  if (cleanSubject.length < 2) {
    throw new Error('Please enter a subject of at least 2 characters.');
  }
  if (cleanMessage.length < 5) {
    throw new Error('Please enter a message of at least 5 characters.');
  }

  const payload = {
    userId: safeUid,
    senderName: sanitizeText(params.senderName, 100) || 'Customer',
    senderEmail: sanitizeText(params.senderEmail, 254),
    subject: cleanSubject,
    message: cleanMessage,
    status: 'open' as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(requireDb(), 'supportMessages', messageId), payload);
    return messageId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function listUserSupportMessages(uid: string): Promise<SupportMessage[]> {
  const safeUid = assertValidId(uid, 'user');
  const path = 'supportMessages';
  try {
    const q = query(
      collection(requireDb(), 'supportMessages'),
      where('userId', '==', safeUid),
      limit(25)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<SupportMessage, 'id'>),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function subscribeToUserSupportMessages(
  uid: string,
  onData: (messages: SupportMessage[]) => void
): Unsubscribe {
  const safeUid = assertValidId(uid, 'user');
  const path = 'supportMessages';
  const q = query(
    collection(requireDb(), 'supportMessages'),
    where('userId', '==', safeUid),
    limit(25)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<SupportMessage, 'id'>),
      }));
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}
