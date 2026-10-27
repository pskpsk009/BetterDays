import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { mentalStyles, PrimaryButton, SecondaryButton } from "../common/ActivityUI";
import { COLORS } from "../common/AppShell";
import { useAuth } from "./AuthProvider";

type Mode = "signIn" | "signUp" | "checkEmail" | "forgot" | "reset" | "resetDone";

const MIN_PASSWORD = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TITLES: Record<Mode, string> = {
  signIn: "Sign in",
  signUp: "Create an account",
  checkEmail: "Check your email",
  forgot: "Reset your password",
  reset: "Enter your code",
  resetDone: "Password updated",
};

/** Sign in, sign up, reset password, or (when signed in) see the account and sign out. */
export function AuthSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const auth = useAuth();
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const trimmedEmail = email.trim();
  const emailOk = EMAIL_PATTERN.test(trimmedEmail);
  const passwordOk = password.length >= MIN_PASSWORD;

  function go(next: Mode) {
    setMode(next);
    setError(null);
    setPassword("");
    setCode("");
  }

  function close() {
    go("signIn");
    onClose();
  }

  async function run(task: () => Promise<string | null>, onSuccess: () => void) {
    setBusy(true);
    setError(null);
    const message = await task();
    setBusy(false);
    if (message) setError(message);
    else onSuccess();
  }

  const signIn = () =>
    run(async () => (await auth.signIn(trimmedEmail, password)).error, close);

  async function signUp() {
    setBusy(true);
    setError(null);
    const result = await auth.signUp(trimmedEmail, password);
    setBusy(false);
    if (result.error) setError(result.error);
    else if (result.needsConfirmation) go("checkEmail");
    else close(); // Signed in straight away when email confirmation is off.
  }

  const sendCode = () =>
    run(async () => (await auth.sendResetCode(trimmedEmail)).error, () => go("reset"));

  const reset = () =>
    run(async () => (await auth.resetPassword(trimmedEmail, code.trim(), password)).error, () => go("resetDone"));

  const signOut = () => run(async () => (await auth.signOut()).error, close);

  const emailInput = (
    <TextInput
      accessibilityLabel="Email"
      value={email}
      onChangeText={setEmail}
      placeholder="Email"
      placeholderTextColor={COLORS.muted}
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="email"
      keyboardType="email-address"
      textContentType="emailAddress"
      style={[mentalStyles.input, styles.input]}
    />
  );

  const passwordInput = (isNew: boolean) => (
    <TextInput
      accessibilityLabel={isNew ? "New password" : "Password"}
      value={password}
      onChangeText={setPassword}
      placeholder={isNew ? `New password (at least ${MIN_PASSWORD} characters)` : "Password"}
      placeholderTextColor={COLORS.muted}
      secureTextEntry
      autoCapitalize="none"
      autoComplete={isNew ? "new-password" : "current-password"}
      textContentType={isNew ? "newPassword" : "password"}
      style={[mentalStyles.input, styles.input]}
    />
  );

  let body: React.ReactNode;

  // A password reset signs the user in, so its "done" screen wins over the account view.
  const showAccount = !!auth.user && mode !== "resetDone";

  if (auth.user && showAccount) {
    body = (
      <>
        <Text accessibilityRole="header" style={styles.title}>Your account</Text>
        <View style={[mentalStyles.card, styles.account]}>
          <Text style={mentalStyles.label}>SIGNED IN AS</Text>
          <Text style={styles.email}>{auth.user.email}</Text>
        </View>
        <Text style={mentalStyles.body}>
          For now your account holds only your email and password. Everything you do in activities still stays on this phone.
        </Text>
        <PrimaryButton label="Sign out" color={COLORS.teal} disabled={busy} onPress={signOut} />
      </>
    );
  } else if (mode === "signIn" || mode === "signUp") {
    const isNew = mode === "signUp";
    body = (
      <>
        <Text accessibilityRole="header" style={styles.title}>{TITLES[mode]}</Text>
        <Text style={mentalStyles.body}>
          An account is optional. MyGrowth works the same without one.
        </Text>
        {emailInput}
        {passwordInput(isNew)}
        {isNew && (
          <Text style={mentalStyles.muted}>
            We store your email and a secure version of your password so you can sign in. Nothing from your activities is sent with it.
          </Text>
        )}
        <PrimaryButton
          label={isNew ? "Create account" : "Sign in"}
          color={COLORS.teal}
          disabled={busy || !emailOk || !passwordOk}
          onPress={isNew ? signUp : signIn}
        />
        {!isNew && <SecondaryButton subtle label="Forgot password?" color={COLORS.muted} onPress={() => go("forgot")} />}
        <SecondaryButton
          label={isNew ? "I already have an account" : "Create an account"}
          color={COLORS.teal}
          onPress={() => go(isNew ? "signIn" : "signUp")}
        />
      </>
    );
  } else if (mode === "checkEmail") {
    body = (
      <>
        <Text accessibilityRole="header" style={styles.title}>{TITLES[mode]}</Text>
        <Text style={mentalStyles.body}>
          We sent a link to {trimmedEmail}. Open it to confirm your email, then come back and sign in.
        </Text>
        <PrimaryButton label="Back to sign in" color={COLORS.teal} onPress={() => go("signIn")} />
      </>
    );
  } else if (mode === "forgot") {
    body = (
      <>
        <Text accessibilityRole="header" style={styles.title}>{TITLES[mode]}</Text>
        <Text style={mentalStyles.body}>Enter your email and we&apos;ll send you a code.</Text>
        {emailInput}
        <PrimaryButton label="Send code" color={COLORS.teal} disabled={busy || !emailOk} onPress={sendCode} />
        <SecondaryButton subtle label="Back to sign in" color={COLORS.muted} onPress={() => go("signIn")} />
      </>
    );
  } else if (mode === "reset") {
    body = (
      <>
        <Text accessibilityRole="header" style={styles.title}>{TITLES[mode]}</Text>
        <Text style={mentalStyles.body}>Type the code we emailed to {trimmedEmail}, then choose a new password.</Text>
        <TextInput
          accessibilityLabel="Code from your email"
          value={code}
          onChangeText={setCode}
          placeholder="Code"
          placeholderTextColor={COLORS.muted}
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          style={[mentalStyles.input, styles.input]}
        />
        {passwordInput(true)}
        <PrimaryButton
          label="Save new password"
          color={COLORS.teal}
          disabled={busy || code.trim().length < 6 || !passwordOk}
          onPress={reset}
        />
        <SecondaryButton subtle label="Send a new code" color={COLORS.muted} onPress={() => go("forgot")} />
      </>
    );
  } else {
    body = (
      <>
        <Text accessibilityRole="header" style={styles.title}>{TITLES[mode]}</Text>
        <Text style={mentalStyles.body}>Your new password is saved and you&apos;re signed in.</Text>
        <PrimaryButton label="Done" color={COLORS.teal} onPress={close} />
      </>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent onRequestClose={close}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.screen, { paddingTop: Math.max(insets.top, 18) + 8 }]}
      >
        <View style={styles.top}>
          <SecondaryButton subtle label="Close" color={COLORS.muted} onPress={close} />
        </View>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View key={showAccount ? "account" : mode} entering={FadeIn.duration(220)} style={mentalStyles.screen}>
            {body}
            {error && (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            )}
            {busy && <ActivityIndicator color={COLORS.teal} />}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, backgroundColor: COLORS.background },
  top: { minHeight: 44, flexDirection: "row", justifyContent: "flex-end" },
  content: { paddingTop: 8 },
  title: { color: "#1C4C55", fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.8 },
  input: { minHeight: 52 },
  account: { gap: 6 },
  email: { color: COLORS.ink, fontSize: 17, fontWeight: "800" },
  error: { color: "#B4442E", fontSize: 14, lineHeight: 20, fontWeight: "600" },
});
