import type { AuthError, Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "../../../src/lib/supabase";

// Optional email + password accounts. The app works fully without one; for now
// an account holds only the email, and activity data stays on the device.

type Result = { error: string | null };

type AuthContextValue = {
  /** The signed-in account, or null. Anonymous sessions (used by Trail sharing) don't count. */
  user: User | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<Result>;
  signUp: (email: string, password: string) => Promise<Result & { needsConfirmation: boolean }>;
  sendResetCode: (email: string) => Promise<Result>;
  resetPassword: (email: string, code: string, password: string) => Promise<Result>;
  changePassword: (current: string, next: string) => Promise<Result>;
  signOut: () => Promise<Result>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}

const MESSAGES: Record<string, string> = {
  invalid_credentials: "That email and password don't match. Check them and try again.",
  email_not_confirmed: "Please confirm your email first. Check your inbox for the link.",
  user_already_exists: "There's already an account with this email. Try signing in.",
  email_exists: "There's already an account with this email. Try signing in.",
  weak_password: "Please choose a stronger password.",
  same_password: "Your new password needs to be different from the old one.",
  over_email_send_rate_limit: "Too many emails were sent. Please wait a few minutes and try again.",
  over_request_rate_limit: "Too many tries. Please wait a moment and try again.",
  otp_expired: "That code has expired or isn't right. Ask for a new one.",
  validation_failed: "Please check your email address.",
};

function friendly(error: AuthError | null): string | null {
  if (!error) return null;
  if (error.code && MESSAGES[error.code]) return MESSAGES[error.code];
  if (error.name === "AuthRetryableFetchError") return "Couldn't reach the server. Check your connection and try again.";
  return error.message;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const user = session?.user && !session.user.is_anonymous ? session.user : null;

  async function leaveAnonymousSession() {
    if (session?.user.is_anonymous) await supabase.auth.signOut({ scope: "local" });
  }

  const value: AuthContextValue = {
    user,
    ready,
    async signIn(email, password) {
      await leaveAnonymousSession();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: friendly(error) };
    },
    async signUp(email, password) {
      await leaveAnonymousSession();
      const { data, error } = await supabase.auth.signUp({ email, password });
      // With "Confirm email" on, Supabase returns no session until the link is clicked.
      return { error: friendly(error), needsConfirmation: !error && !data.session };
    },
    async sendResetCode(email) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error: friendly(error) };
    },
    async resetPassword(email, code, password) {
      const verified = await supabase.auth.verifyOtp({ email, token: code, type: "recovery" });
      if (verified.error) return { error: friendly(verified.error) };
      const { error } = await supabase.auth.updateUser({ password });
      return { error: friendly(error) };
    },
    async changePassword(current, next) {
      const email = session?.user.email;
      if (!email) return { error: "Please sign in again." };
      // Re-checking the current password also gives a fresh session, which
      // Supabase's "secure password change" setting asks for.
      const check = await supabase.auth.signInWithPassword({ email, password: current });
      if (check.error) {
        return { error: check.error.code === "invalid_credentials" ? "Your current password isn't right." : friendly(check.error) };
      }
      const { error } = await supabase.auth.updateUser({ password: next });
      return { error: friendly(error) };
    },
    async signOut() {
      const { error } = await supabase.auth.signOut();
      return { error: friendly(error) };
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
