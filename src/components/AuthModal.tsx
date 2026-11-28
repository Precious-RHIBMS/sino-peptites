import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogOut,
  MailCheck,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDialogAccessibility } from '../utils/useDialogAccessibility';

interface AuthModalProps {
  isOpen: boolean;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  onClose: () => void;
}

type AuthTab = 'login' | 'register' | 'reset';
type AccountTab = 'profile' | 'support';

const COUNTRIES = [
  'United States',
  'Cameroon',
  'Canada',
  'United Kingdom',
  'Germany',
  'Kenya',
  'Ghana',
  'Nigeria',
  'Singapore',
  'Australia',
];

/**
 * Accessible Customer Account, Authentication, Preferences & Support Modal.
 * Preserves the dark navy / electric-blue aesthetic and mobile touch ergonomics.
 */
export function AuthModal({
  isOpen,
  selectedCountry,
  onCountryChange,
  onClose,
}: AuthModalProps) {
  const {
    user,
    profile,
    preferences,
    supportMessages,
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
  } = useAuth();

  const [authTab, setAuthTab] = useState<AuthTab>('login');
  const [accountTab, setAccountTab] = useState<AccountTab>('profile');
  const [notice, setNotice] = useState<string>('');

  // Guest auth form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState(selectedCountry);

  // Authenticated profile & preferences fields
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCountry, setEditCountry] = useState(selectedCountry);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [whatsappNotifs, setWhatsappNotifs] = useState(true);

  // Support ticket fields
  const [supportSubject, setSupportSubject] = useState('');
  const [supportBody, setSupportBody] = useState('');

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogAccessibility(isOpen, dialogRef, closeButtonRef, onClose);

  useEffect(() => {
    if (!isOpen) return;
    setNotice('');
    clearError();
  }, [isOpen, authTab, accountTab, clearError]);

  useEffect(() => {
    if (profile) {
      setEditName(profile.displayName || '');
      setEditPhone(profile.phone || '');
      setEditCountry(profile.preferredCountry || selectedCountry);
    } else if (user) {
      setEditName(user.displayName || '');
      setEditCountry(selectedCountry);
    }
  }, [profile, user, selectedCountry]);

  useEffect(() => {
    if (preferences) {
      setEmailNotifs(preferences.emailNotifications);
      setWhatsappNotifs(preferences.whatsappUpdates);
      if (preferences.preferredCountry) {
        setEditCountry(preferences.preferredCountry);
      }
    }
  }, [preferences]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setNotice('');
    const ok = await login({ email, password });
    if (ok) {
      setPassword('');
      setNotice('Signed in successfully.');
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setNotice('');
    const ok = await register({
      email,
      password,
      displayName,
      preferredCountry: country,
    });
    if (ok) {
      onCountryChange(country);
      setPassword('');
      setNotice('Account created. A verification link has been sent to your email.');
    }
  };

  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setNotice('');
    const ok = await sendPasswordReset(email);
    if (ok) {
      setNotice('Password reset instructions have been sent to your email address.');
    }
  };

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    setNotice('');
    if (!user?.emailVerified) {
      await saveProfile({
        displayName: editName,
        phone: editPhone,
        preferredCountry: editCountry,
      });
      return;
    }
    const okProfile = await saveProfile({
      displayName: editName,
      phone: editPhone,
      preferredCountry: editCountry,
    });
    if (okProfile) {
      onCountryChange(editCountry);
      await savePreferences({
        preferredCountry: editCountry,
        emailNotifications: emailNotifs,
        whatsappUpdates: whatsappNotifs,
        cookieConsent: 'accepted',
      });
      setNotice('Account profile and preferences updated.');
    }
  };

  const handleSupportSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setNotice('');
    const ok = await sendSupportMessage({
      subject: supportSubject,
      message: supportBody,
    });
    if (ok) {
      setSupportSubject('');
      setSupportBody('');
      setNotice('Support message received. Our team will respond shortly.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-[#0A1220] border border-white/15 rounded-2xl p-6 sm:p-7 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#1E90FF]">
              sino_pepts Account
            </span>
            <h2 id="auth-modal-title" className="mt-1 font-serif text-2xl font-bold text-white">
              {user
                ? profile?.displayName || user.displayName || 'Customer Profile'
                : authTab === 'login'
                  ? 'Customer Sign In'
                  : authTab === 'register'
                    ? 'Create Account'
                    : 'Reset Password'}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close account modal"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Status / Error Feedback */}
        {error && (
          <div
            role="alert"
            className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs sm:text-sm text-rose-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs sm:text-sm text-emerald-200"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" aria-hidden="true" />
            <span>{notice}</span>
          </div>
        )}

        {/* Signed-Out Flow */}
        {!user ? (
          <div className="mt-5">
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[#050B14] border border-white/10 mb-5">
              {(
                [
                  { id: 'login', label: 'Sign In' },
                  { id: 'register', label: 'Register' },
                  { id: 'reset', label: 'Recovery' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={authTab === tab.id}
                  onClick={() => setAuthTab(tab.id)}
                  className={`min-h-[44px] rounded-lg text-xs font-semibold transition-colors ${
                    authTab === tab.id
                      ? 'bg-[#1673D6] text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {authTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label htmlFor="auth-login-email" className="block text-xs font-medium text-slate-200 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="auth-login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="researcher@lab.org"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                  />
                </div>

                <div>
                  <label htmlFor="auth-login-pass" className="block text-xs font-medium text-slate-200 mb-1.5">
                    Password
                  </label>
                  <input
                    id="auth-login-pass"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1673D6] hover:bg-[#1E90FF] disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                >
                  {isBusy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  Sign In
                </button>
              </form>
            )}

            {authTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label htmlFor="auth-reg-name" className="block text-xs font-medium text-slate-200 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="auth-reg-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Dr. Clara Bennett"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                  />
                </div>

                <div>
                  <label htmlFor="auth-reg-email" className="block text-xs font-medium text-slate-200 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="auth-reg-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="clara@clinic.org"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                  />
                </div>

                <div>
                  <label htmlFor="auth-reg-pass" className="block text-xs font-medium text-slate-200 mb-1.5">
                    Password (min. 6 characters)
                  </label>
                  <input
                    id="auth-reg-pass"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                  />
                </div>

                <div>
                  <label htmlFor="auth-reg-country" className="block text-xs font-medium text-slate-200 mb-1.5">
                    Preferred Country
                  </label>
                  <select
                    id="auth-reg-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1673D6] hover:bg-[#1E90FF] disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                >
                  {isBusy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  Create Customer Account
                </button>
              </form>
            )}

            {authTab === 'reset' && (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Enter the email address associated with your sino_pepts account to receive a
                  password reset link.
                </p>
                <div>
                  <label htmlFor="auth-reset-email" className="block text-xs font-medium text-slate-200 mb-1.5">
                    Account Email
                  </label>
                  <input
                    id="auth-reset-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="researcher@lab.org"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1673D6] hover:bg-[#1E90FF] disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                >
                  {isBusy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  Send Password Reset Email
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Signed-In Account Console */
          <div className="mt-5 space-y-5">
            {/* Account Summary & Verification Gate */}
            <div className="bg-[#050B14] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      Email Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-amber-300">
                      <MailCheck className="h-4 w-4" aria-hidden="true" />
                      Email Verification Pending
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                disabled={isBusy}
                onClick={logout}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-200 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                Sign Out
              </button>
            </div>

            {!user.emailVerified && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-3">
                <p className="text-xs text-amber-200 leading-relaxed">
                  Verify your email address first to unlock profile updates, synced cloud preferences, and support tickets.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={async () => {
                      const ok = await resendVerification();
                      if (ok) setNotice('Verification email sent. Check your inbox.');
                    }}
                    className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[#1673D6] hover:bg-[#1E90FF] text-white text-xs font-semibold transition-colors"
                  >
                    Resend Verification Email
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={async () => {
                      const verified = await refreshVerification();
                      setNotice(
                        verified
                          ? 'Email verified! Synced features are now active.'
                          : 'Verification not yet detected. Click the link in your email first.'
                      );
                    }}
                    className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[#050B14] border border-white/15 text-slate-200 hover:text-white text-xs font-semibold transition-colors"
                  >
                    Refresh Status
                  </button>
                </div>
              </div>
            )}

            {/* Account Section Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#050B14] border border-white/10">
              <button
                type="button"
                aria-pressed={accountTab === 'profile'}
                onClick={() => setAccountTab('profile')}
                className={`min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-colors ${
                  accountTab === 'profile' ? 'bg-[#1673D6] text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <UserCheck className="h-4 w-4" aria-hidden="true" />
                Profile &amp; Preferences
              </button>
              <button
                type="button"
                aria-pressed={accountTab === 'support'}
                onClick={() => setAccountTab('support')}
                className={`min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-colors ${
                  accountTab === 'support' ? 'bg-[#1673D6] text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Support ({supportMessages.length})
              </button>
            </div>

            {accountTab === 'profile' ? (
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label htmlFor="prof-name" className="block text-xs font-medium text-slate-200 mb-1.5">
                    Display Name
                  </label>
                  <input
                    id="prof-name"
                    type="text"
                    required
                    maxLength={100}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="prof-phone" className="block text-xs font-medium text-slate-200 mb-1.5">
                      Phone (Optional)
                    </label>
                    <input
                      id="prof-phone"
                      type="tel"
                      maxLength={30}
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+1 (503) 555-0148"
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                    />
                  </div>
                  <div>
                    <label htmlFor="prof-country" className="block text-xs font-medium text-slate-200 mb-1.5">
                      Default Country
                    </label>
                    <select
                      id="prof-country"
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <label className="flex items-center gap-3 min-h-[44px] text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifs}
                      onChange={(e) => setEmailNotifs(e.target.checked)}
                      className="h-4 w-4 accent-[#1E90FF]"
                    />
                    Receive account and batch COA email notifications
                  </label>
                  <label className="flex items-center gap-3 min-h-[44px] text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={whatsappNotifs}
                      onChange={(e) => setWhatsappNotifs(e.target.checked)}
                      className="h-4 w-4 accent-[#1E90FF]"
                    />
                    Allow WhatsApp follow-up on product inquiries
                  </label>
                </div>

                {!user.emailVerified && (
                  <p className="text-xs text-amber-200 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
                    Please verify your email address before saving profile updates or preferences.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isBusy || !user.emailVerified}
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1673D6] hover:bg-[#1E90FF] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                >
                  {isBusy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  Save Profile &amp; Preferences
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                <form onSubmit={handleSupportSubmit} className="space-y-3.5">
                  <div>
                    <label htmlFor="sup-subject" className="block text-xs font-medium text-slate-200 mb-1.5">
                      Subject
                    </label>
                    <input
                      id="sup-subject"
                      type="text"
                      required
                      minLength={2}
                      maxLength={160}
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      placeholder="Batch COA verification or shipping question"
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                    />
                  </div>
                  <div>
                    <label htmlFor="sup-message" className="block text-xs font-medium text-slate-200 mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="sup-message"
                      rows={3}
                      required
                      minLength={5}
                      maxLength={2000}
                      value={supportBody}
                      onChange={(e) => setSupportBody(e.target.value)}
                      placeholder="Write your message for our support team..."
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isBusy || !user.emailVerified}
                    className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1673D6] hover:bg-[#1E90FF] disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                  >
                    {isBusy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    Send Support Message
                  </button>
                </form>

                {supportMessages.length > 0 && (
                  <div className="border-t border-white/10 pt-4 space-y-2.5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Recent Inquiries
                    </h3>
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {supportMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className="bg-[#050B14] border border-white/10 rounded-xl p-3 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-white truncate">{msg.subject}</span>
                            <span className="px-2 py-0.5 rounded bg-[#1E90FF]/15 text-[#1E90FF] font-mono text-[10px] uppercase shrink-0">
                              {msg.status}
                            </span>
                          </div>
                          <p className="mt-1 text-slate-300 line-clamp-2">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
