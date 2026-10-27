import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon, IconName } from "../common/AppIcon";
import { useAuth } from "../auth/AuthProvider";
import { AuthSheet } from "../auth/AuthSheet";
import { mentalStyles, PrimaryButton, SecondaryButton } from "../common/ActivityUI";
import { COLORS } from "../common/AppShell";
import { forgetOnThisDevice, hasSavedData } from "../common/localStore";
import { useBackup } from "../sync/BackupProvider";
import { deleteAccount, deleteAllData, exportData } from "./deleteAllData";
import { PRIVACY_SECTIONS } from "./privacyRules";

type Screen =
  | "menu"
  | "password"
  | "passwordDone"
  | "privacy"
  | "backup"
  | "delete"
  | "deleted"
  | "deleteAccount"
  | "accountDeleted"
  | "signOut"
  | "signedOut";

const MIN_PASSWORD = 8;
const DANGER = "#B4442E";

const DELETED_ITEMS = [
  "My Support Circle",
  "Values Compass",
  "Your skills in Develop Your Skill",
  "Your sleep schedule and sleep logs",
  "Your welcome picks",
  "Your activity history in Progress",
  "Any trail drawings you shared",
  "Your account backup, if it's on",
];

const BACKED_UP = ["My Support Circle", "Values Compass", "Develop Your Skill", "Sleep schedule and logs", "Your welcome picks", "Your activity history"];

const BACKUP_TERMS = [
  "Only you can see it. It's linked to your account and nobody else using MyGrowth can read it.",
  "It's used only to restore your data. Never for ads, selling, or deciding anything about you.",
  "It's kept until you turn backup off or delete your account. Either one deletes the copy.",
  "Activities that don't save anything on your phone aren't copied either.",
];

/** Profile: account, password, backup, privacy rules, export, and deletion. */
export function ProfileSheet({
  visible,
  onClose,
  onShowWelcome,
}: {
  visible: boolean;
  onClose: () => void;
  onShowWelcome: () => void;
}) {
  const insets = useSafeAreaInsets();
  const auth = useAuth();
  const backup = useBackup();
  const [view, setView] = useState<Screen>("menu");
  const [showAuth, setShowAuth] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function go(target: Screen) {
    setView(target);
    setError(null);
    setCurrent("");
    setNext("");
    setRepeat("");
  }

  function close() {
    go("menu");
    onClose();
  }

  async function changePassword() {
    setBusy(true);
    setError(null);
    const result = await auth.changePassword(current, next);
    setBusy(false);
    if (result.error) setError(result.error);
    else go("passwordDone");
  }

  // Uploads pending changes first, then signs out. Removing data happens only
  // after sign-out succeeds, and never touches the account backup.
  function signOut(removeFromPhone: boolean) {
    return run(
      async () => {
        await backup.flush();
        const result = await auth.signOut();
        if (result.error) return result.error;
        if (removeFromPhone) forgetOnThisDevice();
        return null;
      },
      () => (removeFromPhone ? go("signedOut") : go("menu")),
    );
  }

  async function deleteEverything() {
    setBusy(true);
    setError(null);
    const result = await deleteAllData();
    setBusy(false);
    if (result.error) setError(result.error);
    else go("deleted");
  }

  async function run(task: () => Promise<string | null>, onSuccess?: () => void) {
    setBusy(true);
    setError(null);
    const message = await task();
    setBusy(false);
    if (message) setError(message);
    else onSuccess?.();
  }

  const bullets = (items: string[]) =>
    items.map((item) => (
      <View key={item} style={styles.point}>
        <Text style={styles.pointDot}>•</Text>
        <Text style={[mentalStyles.body, styles.pointText]}>{item}</Text>
      </View>
    ));

  const passwordField = (label: string, value: string, onChange: (text: string) => void, isNew: boolean) => (
    <TextInput
      accessibilityLabel={label}
      value={value}
      onChangeText={onChange}
      placeholder={label}
      placeholderTextColor={COLORS.muted}
      secureTextEntry
      autoCapitalize="none"
      autoComplete={isNew ? "new-password" : "current-password"}
      textContentType={isNew ? "newPassword" : "password"}
      style={[mentalStyles.input, styles.input]}
    />
  );

  let body: React.ReactNode;

  if (view === "password" && auth.user) {
    const mismatch = repeat.length > 0 && repeat !== next;
    body = (
      <>
        <BackLink onPress={() => go("menu")} />
        <Text accessibilityRole="header" style={styles.title}>Change password</Text>
        {passwordField("Current password", current, setCurrent, false)}
        {passwordField(`New password (at least ${MIN_PASSWORD} characters)`, next, setNext, true)}
        {passwordField("Type the new password again", repeat, setRepeat, true)}
        {mismatch && <Text style={styles.error}>The new passwords don&apos;t match.</Text>}
        <PrimaryButton
          label="Save new password"
          color={COLORS.teal}
          disabled={busy || !current || next.length < MIN_PASSWORD || repeat !== next}
          onPress={changePassword}
        />
      </>
    );
  } else if (view === "passwordDone") {
    body = (
      <>
        <Text accessibilityRole="header" style={styles.title}>Password changed</Text>
        <Text style={mentalStyles.body}>Use your new password next time you sign in.</Text>
        <PrimaryButton label="Back to profile" color={COLORS.teal} onPress={() => go("menu")} />
      </>
    );
  } else if (view === "privacy") {
    body = (
      <>
        <BackLink onPress={() => go("menu")} />
        <Text accessibilityRole="header" style={styles.title}>Privacy rules</Text>
        <Text style={mentalStyles.body}>How MyGrowth handles your data, in plain words.</Text>
        {PRIVACY_SECTIONS.map((section) => (
          <View key={section.title} style={[mentalStyles.card, styles.section]}>
            <Text style={styles.sectionTitle}>
              <AppIcon name={section.icon} size={17} color={COLORS.teal} /> {section.title}
            </Text>
            {section.points.map((point) => (
              <View key={point} style={styles.point}>
                <Text style={styles.pointDot}>•</Text>
                <Text style={[mentalStyles.body, styles.pointText]}>{point}</Text>
              </View>
            ))}
          </View>
        ))}
      </>
    );
  } else if (view === "backup" && auth.user) {
    const on = backup.status !== "off";
    body = (
      <>
        <BackLink onPress={() => go("menu")} />
        <Text accessibilityRole="header" style={styles.title}>Back up to my account</Text>
        {on ? (
          <>
            <View style={[mentalStyles.card, styles.section]}>
              <Text style={styles.sectionTitle}><AppIcon name="cloud-outline" size={17} color={COLORS.teal} /> Backup is on</Text>
              <Text style={mentalStyles.body}>{backupStatusText(backup.status, backup.lastSynced)}</Text>
            </View>
            <Text style={mentalStyles.body}>
              Changes are saved to your account a moment after you make them. Sign in on a new phone to get them back.
            </Text>
            <SecondaryButton label="Sync now" color={COLORS.teal} disabled={backup.status === "syncing"} onPress={backup.syncNow} />
            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={() => run(backup.turnOff)}
              style={({ pressed }) => [styles.dangerButton, busy && styles.disabled, pressed && styles.pressed]}
            >
              <Text style={styles.dangerText}>Turn off and delete the backup</Text>
            </Pressable>
            <Text style={mentalStyles.muted}>Turning it off deletes the copy in your account. Everything on this phone stays.</Text>
          </>
        ) : (
          <>
            <Text style={mentalStyles.body}>
              Keep a copy of what you save in MyGrowth in your account, so you don&apos;t lose it if you change phones.
            </Text>
            <View style={[mentalStyles.card, styles.section]}>
              <Text style={styles.sectionTitle}>What&apos;s copied</Text>
              {bullets(BACKED_UP)}
            </View>
            <View style={[mentalStyles.card, styles.section]}>
              <Text style={styles.sectionTitle}>How it&apos;s handled</Text>
              {bullets(BACKUP_TERMS)}
            </View>
            <PrimaryButton label="Turn on backup" color={COLORS.teal} disabled={busy} onPress={() => run(backup.turnOn)} />
            <SecondaryButton subtle label="Not now" color={COLORS.muted} onPress={() => go("menu")} />
          </>
        )}
      </>
    );
  } else if (view === "deleteAccount" && auth.user) {
    body = (
      <>
        <BackLink onPress={() => go("menu")} />
        <Text accessibilityRole="header" style={styles.title}>Delete your account?</Text>
        <Text style={mentalStyles.body}>
          This permanently deletes your account ({auth.user.email}), its backup, any trails you shared, and everything
          saved on this phone. It can&apos;t be undone.
        </Text>
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={() => run(async () => (await deleteAccount()).error, () => go("accountDeleted"))}
          style={({ pressed }) => [styles.dangerButton, busy && styles.disabled, pressed && styles.pressed]}
        >
          <Text style={styles.dangerText}>Delete my account</Text>
        </Pressable>
        <SecondaryButton subtle label="Keep my account" color={COLORS.muted} onPress={() => go("menu")} />
      </>
    );
  } else if (view === "signOut" && auth.user) {
    const backedUp = backup.status !== "off";
    const hasData = hasSavedData();
    body = (
      <>
        <BackLink onPress={() => go("menu")} />
        <Text accessibilityRole="header" style={styles.title}>Sign out</Text>
        <Text style={mentalStyles.body}>
          What should happen to your MyGrowth data on this phone? Remove it if other people use this phone.
        </Text>
        {hasData && !backedUp && (
          <View style={[styles.warning]}>
            <Text style={styles.warningText}>
              Backup is off, so removing your data deletes it for good. Turn on backup first if you want to keep a copy.
            </Text>
          </View>
        )}
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={() => signOut(true)}
          style={({ pressed }) => [mentalStyles.card, styles.choice, pressed && styles.rowPressed, busy && styles.disabled]}
        >
          <AppIcon name="broom" size={26} color={COLORS.ink} />
          <View style={styles.rowCopy}>
            <Text style={styles.rowTitle}>Remove my data from this phone</Text>
            <Text style={mentalStyles.muted}>
              {backedUp
                ? "Your backup stays in your account. Sign in again to get it back."
                : "The next person starts fresh. This can't be undone."}
            </Text>
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={() => signOut(false)}
          style={({ pressed }) => [mentalStyles.card, styles.choice, pressed && styles.rowPressed, busy && styles.disabled]}
        >
          <AppIcon name="cellphone" size={26} color={COLORS.ink} />
          <View style={styles.rowCopy}>
            <Text style={styles.rowTitle}>Keep it on this phone</Text>
            <Text style={mentalStyles.muted}>Best if this is your own phone. You can keep using everything without signing in.</Text>
          </View>
        </Pressable>
        <SecondaryButton subtle label="Stay signed in" color={COLORS.muted} onPress={() => go("menu")} />
      </>
    );
  } else if (view === "signedOut") {
    body = (
      <>
        <Text accessibilityRole="header" style={styles.title}>Signed out</Text>
        <Text style={mentalStyles.body}>Your data has been removed from this phone. MyGrowth will start fresh.</Text>
        <PrimaryButton label="Done" color={COLORS.teal} onPress={close} />
      </>
    );
  } else if (view === "accountDeleted") {
    body = (
      <>
        <Text accessibilityRole="header" style={styles.title}>Account deleted</Text>
        <Text style={mentalStyles.body}>Your account and its data are gone. You can keep using MyGrowth without an account.</Text>
        <PrimaryButton label="Done" color={COLORS.teal} onPress={close} />
      </>
    );
  } else if (view === "delete") {
    body = (
      <>
        <BackLink onPress={() => go("menu")} />
        <Text accessibilityRole="header" style={styles.title}>Delete all data?</Text>
        <Text style={mentalStyles.body}>This permanently deletes:</Text>
        <View style={[mentalStyles.card, styles.section]}>{bullets(DELETED_ITEMS)}</View>
        <Text style={mentalStyles.muted}>
          {auth.user
            ? "Your account (email and password) stays, so you can still sign in. It can't be undone."
            : "It can't be undone."}
        </Text>
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={deleteEverything}
          style={({ pressed }) => [styles.dangerButton, busy && styles.disabled, pressed && styles.pressed]}
        >
          <Text style={styles.dangerText}>Delete everything</Text>
        </Pressable>
        <SecondaryButton subtle label="Keep my data" color={COLORS.muted} onPress={() => go("menu")} />
      </>
    );
  } else if (view === "deleted") {
    body = (
      <>
        <Text accessibilityRole="header" style={styles.title}>All data deleted</Text>
        <Text style={mentalStyles.body}>MyGrowth is back to a fresh start. The welcome will show again.</Text>
        <PrimaryButton label="Done" color={COLORS.teal} onPress={close} />
      </>
    );
  } else {
    body = (
      <>
        <Text accessibilityRole="header" style={styles.title}>Profile</Text>
        <View style={[mentalStyles.card, styles.account]}>
          {auth.user ? (
            <>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{auth.user.email?.[0]?.toUpperCase()}</Text>
              </View>
              <View style={styles.accountCopy}>
                <Text style={mentalStyles.label}>SIGNED IN AS</Text>
                <Text style={styles.email} numberOfLines={1}>{auth.user.email}</Text>
              </View>
            </>
          ) : (
            <View style={styles.accountCopy}>
              <Text style={styles.email}>You&apos;re not signed in</Text>
              <Text style={mentalStyles.muted}>An account is optional. MyGrowth works the same without one.</Text>
              <PrimaryButton label="Sign in or create an account" color={COLORS.teal} onPress={() => setShowAuth(true)} />
            </View>
          )}
        </View>

        {auth.user && (
          <View style={styles.group}>
            <Row
              icon="cloud-outline"
              title="Back up to my account"
              detail={backup.status === "off" ? "Off" : backupStatusText(backup.status, backup.lastSynced)}
              onPress={() => go("backup")}
            />
            <Row icon="key-outline" title="Change password" onPress={() => go("password")} />
            <Row icon="logout" title="Sign out" onPress={() => go("signOut")} disabled={busy} />
          </View>
        )}

        <View style={styles.group}>
          <Row icon="lock-outline" title="Privacy rules" detail="How your data is handled" onPress={() => go("privacy")} />
          <Row
            icon="export-variant"
            title="Download my data"
            detail="A copy of everything saved on this phone"
            disabled={busy}
            onPress={() => run(async () => (await exportData(auth.user?.email ?? null, auth.user?.id ?? null)).error)}
          />
          <Row
            icon="hand-wave-outline"
            title="Show the welcome again"
            detail="And change what shows first on Home"
            onPress={() => {
              close();
              onShowWelcome();
            }}
          />
        </View>

        <View style={styles.group}>
          <Row
            icon="trash-can-outline"
            title="Delete all data"
            detail="Everything on this phone, your backup, and any shared trails"
            danger
            onPress={() => go("delete")}
          />
          {auth.user && (
            <Row icon="alert-outline" title="Delete account" detail="Your account and all of its data" danger onPress={() => go("deleteAccount")} />
          )}
        </View>
      </>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent onRequestClose={view === "menu" ? close : () => go("menu")}>
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
          <Animated.View key={view} entering={FadeIn.duration(220)} style={mentalStyles.screen}>
            {body}
            {error && (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            )}
            {busy && <ActivityIndicator color={COLORS.teal} />}
          </Animated.View>
        </ScrollView>
        {/* Nested so it can present on top of this sheet on iOS. */}
        <AuthSheet visible={showAuth} onClose={() => setShowAuth(false)} />
      </KeyboardAvoidingView>
    </Modal>
  );
}

function backupStatusText(status: ReturnType<typeof useBackup>["status"], lastSynced: number | null) {
  if (status === "checking" || status === "syncing") return "Syncing…";
  if (status === "error") return "Couldn't sync. We'll try again when you're online.";
  if (!lastSynced) return "On";
  const minutes = Math.round((Date.now() - lastSynced) / 60000);
  return minutes < 1 ? "Synced just now" : `Synced ${minutes} min ago`;
}

function Row({
  icon,
  title,
  detail,
  danger,
  disabled,
  onPress,
}: {
  icon: IconName;
  title: string;
  detail?: string;
  danger?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={detail ? `${title}. ${detail}` : title}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed, disabled && styles.disabled]}
    >
      <AppIcon name={icon} size={20} color={danger ? DANGER : COLORS.teal} style={styles.rowIcon} />
      <View style={styles.rowCopy}>
        <Text style={[styles.rowTitle, danger && { color: DANGER }]}>{title}</Text>
        {detail ? <Text style={mentalStyles.muted}>{detail}</Text> : null}
      </View>
      <Text style={[styles.chevron, danger && { color: DANGER }]}>›</Text>
    </Pressable>
  );
}

function BackLink({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" hitSlop={8} onPress={onPress} style={styles.backLink}>
      <Text style={styles.backLinkText}>‹ Profile</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, backgroundColor: COLORS.background },
  top: { minHeight: 44, flexDirection: "row", justifyContent: "flex-end" },
  content: { paddingTop: 8 },
  title: { color: "#1C4C55", fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.8 },
  account: { flexDirection: "row", alignItems: "center", gap: 14 },
  accountCopy: { flex: 1, gap: 8 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.tealSoft,
    borderWidth: 1.5,
    borderColor: COLORS.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: COLORS.teal, fontSize: 21, fontWeight: "800" },
  email: { color: COLORS.ink, fontSize: 17, fontWeight: "800" },
  group: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },
  row: {
    minHeight: 60,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  rowPressed: { backgroundColor: COLORS.tealSoft },
  rowIcon: { width: 26, textAlign: "center" },
  rowCopy: { flex: 1, gap: 2 },
  rowTitle: { color: COLORS.ink, fontSize: 15, fontWeight: "800" },
  chevron: { color: COLORS.muted, fontSize: 26, fontWeight: "500" },
  section: { gap: 8 },
  sectionTitle: { color: COLORS.ink, fontSize: 16, fontWeight: "800" },
  point: { flexDirection: "row", gap: 8 },
  pointDot: { color: COLORS.teal, fontSize: 14, lineHeight: 21, fontWeight: "800" },
  pointText: { flex: 1 },
  input: { minHeight: 52 },
  backLink: { alignSelf: "flex-start", paddingVertical: 4 },
  backLinkText: { color: COLORS.teal, fontSize: 14, fontWeight: "800" },
  dangerButton: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DANGER,
  },
  dangerText: { color: COLORS.white, fontSize: 15, fontWeight: "800" },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.78 },
  choice: { flexDirection: "row", alignItems: "center", gap: 14 },
  warning: { padding: 14, borderRadius: 14, backgroundColor: "#FBEAE5" },
  warningText: { color: DANGER, fontSize: 13, lineHeight: 19, fontWeight: "700" },
  error: { color: DANGER, fontSize: 14, lineHeight: 20, fontWeight: "600" },
});
