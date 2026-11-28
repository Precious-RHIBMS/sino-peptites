import { FirebaseError } from 'firebase/app';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import {
  createInitialCustomerProfile,
  getCustomerProfile,
  updateCustomerProfile,
} from './firestoreService';

function requireAuth(): Auth {
  if (!auth) {
    throw new Error(
      'Firebase is not configured yet. Please add your VITE_FIREBASE_* environment variables in AI Studio Secrets.'
    );
  }
  return auth;
}

/**
 * Translates Firebase Auth error codes into clear, customer-friendly messages.
 */
export function mapAuthError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists. Please sign in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Incorrect email or password. Please verify your credentials or reset your password.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support for assistance.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a few minutes and try again.';
      case 'auth/user-token-expired':
        return 'Your session expired. Please sign in again to continue.';
      case 'auth/operation-not-allowed':
        return 'Email/Password sign-in is not yet enabled in the Firebase Console.';
      case 'auth/network-request-failed':
        return 'Network connection failed. Please check your internet connection and retry.';
      default:
        return 'Authentication request could not be completed. Please try again.';
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'An unexpected authentication error occurred.';
}

export async function registerCustomer(params: {
  email: string;
  password: string;
  displayName: string;
  preferredCountry: string;
}): Promise<User> {
  const cleanEmail = params.email.trim();
  const cleanName = params.displayName.trim();

  const firebaseAuth = requireAuth();
  const credential = await createUserWithEmailAndPassword(firebaseAuth, cleanEmail, params.password);

  if (cleanName) {
    await updateProfile(credential.user, { displayName: cleanName });
  }

  await sendEmailVerification(credential.user);

  await createInitialCustomerProfile({
    uid: credential.user.uid,
    email: credential.user.email || cleanEmail,
    displayName: cleanName || cleanEmail.split('@')[0] || 'Customer',
    preferredCountry: params.preferredCountry,
    emailVerified: credential.user.emailVerified,
  });

  return credential.user;
}

export async function loginCustomer(params: {
  email: string;
  password: string;
}): Promise<User> {
  const firebaseAuth = requireAuth();
  const credential = await signInWithEmailAndPassword(
    firebaseAuth,
    params.email.trim(),
    params.password
  );

  // Sync customer profile if missing or verification state changed
  const existing = await getCustomerProfile(credential.user.uid);
  if (!existing) {
    await createInitialCustomerProfile({
      uid: credential.user.uid,
      email: credential.user.email || params.email.trim(),
      displayName:
        credential.user.displayName || params.email.trim().split('@')[0] || 'Customer',
      preferredCountry: 'United States',
      emailVerified: credential.user.emailVerified,
    });
  } else if (credential.user.emailVerified && !existing.emailVerified) {
    await updateCustomerProfile(credential.user.uid, {
      emailVerified: true,
    });
  }

  return credential.user;
}

export async function logoutCustomer(): Promise<void> {
  await signOut(requireAuth());
}

export async function requestPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(requireAuth(), email.trim());
}

export async function resendVerificationEmail(): Promise<void> {
  const firebaseAuth = requireAuth();
  if (!firebaseAuth.currentUser) {
    throw new Error('You must be signed in to request a verification email.');
  }
  await sendEmailVerification(firebaseAuth.currentUser);
}

export async function refreshCurrentUser(): Promise<User | null> {
  const firebaseAuth = requireAuth();
  if (!firebaseAuth.currentUser) return null;

  await reload(firebaseAuth.currentUser);
  const refreshed = firebaseAuth.currentUser;
  if (!refreshed) return null;

  // Force ID token refresh so request.auth.token.email_verified matches the reloaded state
  await refreshed.getIdToken(true);

  if (refreshed.emailVerified) {
    try {
      const existing = await getCustomerProfile(refreshed.uid);
      if (existing && !existing.emailVerified) {
        await updateCustomerProfile(refreshed.uid, {
          emailVerified: true,
        });
      }
    } catch (syncError) {
      console.warn('Unable to sync email verification status to Firestore profile:', syncError);
    }
  }

  return refreshed;
}
