import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import {
  ActivityHeader,
  ActivityProps,
  mentalStyles,
  PrimaryButton,
  SavedOnDeviceNote,
  SecondaryButton,
  SelectionChip,
  toggleItem,
} from "../common/ActivityUI";
import { AppIcon } from "../common/AppIcon";
import { COLORS } from "../common/AppShell";
import { ChoiceGroup, ChoiceExplorer, ChoiceOption } from "../common/GuidedActivities";
import { pickForDay, useStoredState } from "../common/localStore";

// My Support Circle: map the people and places you can turn to, then come
// back to it when you need someone. Names are optional and stay on the phone.

const BRANCH = "Stand Up Again";
const TITLE = "My Support Circle";

type GroupId = "people" | "professional" | "things";
type Ring = "close" | "middle" | "outer";
type NeedTag = "talk" | "school" | "laugh" | "advice";

type Member = {
  id: string;
  label: string;
  icon: string;
  group: GroupId;
  /** Optional name or nickname. */
  name: string;
  ring: Ring;
  goodFor: NeedTag[];
};

const GROUPS: (ChoiceGroup & { id: GroupId })[] = [
  {
    id: "people",
    title: "People",
    options: [
      { label: "A friend", icon: "account-multiple-outline", note: "Someone to talk to, or just spend time with." },
      { label: "A family member", icon: "home-heart", note: "Someone at home or further away who cares about you." },
      { label: "A teacher or mentor", icon: "school-outline", note: "Can help with school or work worries, and point you to support." },
      { label: "A coach or club leader", icon: "whistle-outline", note: "Someone from an activity you're part of." },
      { label: "A classmate or colleague", icon: "hand-wave-outline", note: "Can help with shared tasks and everyday stress." },
    ],
  },
  {
    id: "professional",
    title: "Professional support",
    options: [
      { label: "School or campus counsellor", icon: "chat-outline", note: "Trained to listen and help you work through difficulties." },
      { label: "Doctor or nurse", icon: "stethoscope", note: "For health concerns, including how you're feeling." },
      { label: "A support line", icon: "phone-outline", note: "Confidential support by phone or chat in many places." },
    ],
  },
  {
    id: "things",
    title: "Things that help me",
    options: [
      { label: "A calming place", icon: "tree-outline", note: "Somewhere you feel settled and safe." },
      { label: "An online community", icon: "laptop", note: "A safe, moderated group with shared interests." },
      { label: "A pet", icon: "paw", note: "Companionship and comfort." },
    ],
  },
];

// Members saved by an older version may still hold an emoji, so look the icon up by label.
const ICON_BY_LABEL = new Map(GROUPS.flatMap((group) => group.options.map((option) => [option.label, option.icon])));

function iconOf(member: { label: string; icon: string }) {
  return ICON_BY_LABEL.get(member.label) ?? member.icon;
}

const RINGS: { id: Ring; label: string; radius: number }[] = [
  { id: "close", label: "Closest", radius: 60 },
  { id: "middle", label: "Close", radius: 100 },
  { id: "outer", label: "Further out", radius: 138 },
];

const NEEDS: { id: NeedTag; label: string; icon: string }[] = [
  { id: "talk", label: "Someone to talk to", icon: "chat-outline" },
  { id: "school", label: "Help with schoolwork", icon: "bookshelf" },
  { id: "laugh", label: "A laugh", icon: "emoticon-lol-outline" },
  { id: "advice", label: "Advice", icon: "compass-outline" },
];

const SAFETY =
  "If you ever feel unsafe or in crisis, please contact your local emergency number or a crisis support line right away.";

const SIZE = 300;
const BUBBLE = 46;

function groupOf(label: string): GroupId {
  return GROUPS.find((group) => group.options.some((option) => option.label === label))?.id ?? "people";
}

const displayName = (member: Member) => member.name.trim() || member.label;

type Stage = "pick" | "details" | "circle";

export function SupportCircle({ color, soft, onExit }: ActivityProps) {
  const [members, setMembers, clearMembers] = useStoredState<Member[] | null>("support-circle", null);
  const [stage, setStage] = useState<Stage>(members ? "circle" : "pick");
  const [draft, setDraft] = useState<Member[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [need, setNeed] = useState<NeedTag | null>(null);
  const [hideNudge, setHideNudge] = useState(false);

  const header = <ActivityHeader eyebrow={BRANCH} title={TITLE} color={color} />;
  const exit = <SecondaryButton subtle label={`Back to ${BRANCH}`} color={COLORS.muted} onPress={onExit} />;

  if (stage === "pick" || (stage === "circle" && !members)) {
    return (
      <ChoiceExplorer
        color={color}
        soft={soft}
        onExit={members ? () => setStage("circle") : onExit}
        branch={BRANCH}
        title={TITLE}
        intro="Nobody has to handle everything alone. Pick the people and places you could turn to. You can add names next."
        pickLabel="My circle"
        groups={GROUPS}
        initialPicks={members?.map((member) => ({ label: member.label, icon: iconOf(member), note: "" }))}
        customPlaceholder="Add someone or something else…"
        customNote="Part of your support circle."
        resultTitle="Your support circle"
        resultIntro="These are the people and places you can lean on. Next, you can add names and how close each one feels."
        safetyNote={SAFETY}
        completeLabel="Next: add names"
        onComplete={(picked: ChoiceOption[]) => {
          setDraft(
            picked.map((option) => {
              const existing = members?.find((member) => member.label === option.label);
              return (
                existing ?? {
                  id: option.label,
                  label: option.label,
                  icon: option.icon,
                  group: groupOf(option.label),
                  name: "",
                  ring: groupOf(option.label) === "professional" ? "outer" : "middle",
                  goodFor: [],
                }
              );
            }),
          );
          setStage("details");
        }}
        completion={{ badge: "account-group-outline", title: "Circle mapped", message: "" }}
      />
    );
  }

  if (stage === "details") {
    const update = (id: string, change: Partial<Member>) =>
      setDraft(draft.map((member) => (member.id === id ? { ...member, ...change } : member)));
    return (
      <View style={mentalStyles.screen}>
        {header}
        <Text style={mentalStyles.body}>
          Add a name or nickname if you like, and choose how close each one feels. Both are optional.
        </Text>
        {draft.map((member) => (
          <View key={member.id} style={[mentalStyles.card, styles.detail]}>
            <Text style={styles.detailTitle}>
              <AppIcon name={iconOf(member)} size={16} color={color} /> {member.label}
            </Text>
            {member.group !== "professional" && (
              <TextInput
                accessibilityLabel={`Name for ${member.label}`}
                value={member.name}
                onChangeText={(name) => update(member.id, { name })}
                placeholder="Name or nickname (optional)"
                placeholderTextColor={COLORS.muted}
                style={mentalStyles.input}
              />
            )}
            {member.group !== "professional" && (
              <View style={mentalStyles.chips}>
                {RINGS.map((ring) => (
                  <SelectionChip
                    key={ring.id}
                    label={ring.label}
                    color={color}
                    selected={member.ring === ring.id}
                    onPress={() => update(member.id, { ring: ring.id })}
                  />
                ))}
              </View>
            )}
          </View>
        ))}
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setStage("pick")} />
          <PrimaryButton
            flex
            label="Save my circle"
            color={color}
            onPress={() => {
              setMembers(draft);
              setStage("circle");
            }}
          />
        </View>
        <Text style={[mentalStyles.muted, styles.center]}>
          <AppIcon name="lock-outline" size={14} color={COLORS.muted} /> Saved on this phone only. It isn&apos;t sent anywhere, and you can delete it at any time.
        </Text>
      </View>
    );
  }

  const circle = members ?? [];
  const drawn = circle.filter((member) => member.group !== "professional");
  const professional = circle.filter((member) => member.group === "professional");
  const people = circle.filter((member) => member.group === "people");
  const nudge = people.length ? pickForDay(people) : null;
  const active = circle.find((member) => member.id === selected) ?? null;
  const matches = need ? circle.filter((member) => member.goodFor.includes(need)) : [];

  const change = (id: string, next: Partial<Member>) =>
    setMembers((list) => (list ?? []).map((member) => (member.id === id ? { ...member, ...next } : member)));

  return (
    <View style={mentalStyles.screen}>
      {header}

      {nudge && !hideNudge && (
        <View style={[styles.nudge, { backgroundColor: soft }]}>
          <Text style={mentalStyles.body}>
            <AppIcon name="hand-wave-outline" size={16} color={color} /> Send {displayName(nudge)} a quick hello today? Even &quot;Thinking of you&quot; counts.
          </Text>
          <SecondaryButton label="Maybe another day" color={color} onPress={() => setHideNudge(true)} />
        </View>
      )}

      <View style={styles.circleWrap}>
        <View style={{ width: SIZE, height: SIZE }}>
          <Svg width={SIZE} height={SIZE}>
            {RINGS.slice()
              .reverse()
              .map((ring, index) => (
                <Circle
                  key={ring.id}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={ring.radius}
                  fill={color}
                  opacity={0.06 + index * 0.05}
                />
              ))}
          </Svg>
          <View style={[styles.me, { backgroundColor: color, left: SIZE / 2 - 24, top: SIZE / 2 - 24 }]}>
            <Text style={styles.meText}>Me</Text>
          </View>
          {RINGS.flatMap((ring, ringIndex) => {
            const onRing = drawn.filter((member) => member.ring === ring.id);
            return onRing.map((member, index) => {
              const angle = ((index / onRing.length) * 360 - 90 + ringIndex * 30) * (Math.PI / 180);
              const x = SIZE / 2 + ring.radius * Math.cos(angle);
              const y = SIZE / 2 + ring.radius * Math.sin(angle);
              const isActive = member.id === selected;
              return (
                <Pressable
                  key={member.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${displayName(member)}, ${ring.label.toLowerCase()}`}
                  onPress={() => setSelected(isActive ? null : member.id)}
                  style={[styles.bubbleSlot, { left: x - 36, top: y - BUBBLE / 2 }]}
                >
                  <View style={[styles.bubble, { borderColor: isActive ? color : COLORS.border }]}>
                    <AppIcon name={iconOf(member)} size={22} color={isActive ? color : COLORS.ink} />
                  </View>
                  <Text numberOfLines={1} style={styles.bubbleLabel}>
                    {displayName(member)}
                  </Text>
                </Pressable>
              );
            });
          })}
        </View>
        <Text style={mentalStyles.muted}>Tap someone to tag what they&apos;re good for.</Text>
      </View>

      {active && (
        <View style={[mentalStyles.card, styles.detail]}>
          <Text style={styles.detailTitle}>
            <AppIcon name={iconOf(active)} size={16} color={color} /> {displayName(active)}
          </Text>
          {active.name.trim() ? <Text style={mentalStyles.muted}>{active.label}</Text> : null}
          <Text style={mentalStyles.label}>GOOD FOR</Text>
          <View style={mentalStyles.chips}>
            {NEEDS.map((item) => (
              <SelectionChip
                key={item.id}
                icon={item.icon}
                label={item.label}
                color={color}
                selected={active.goodFor.includes(item.id)}
                onPress={() => change(active.id, { goodFor: toggleItem(active.goodFor, item.id) })}
              />
            ))}
          </View>
          {active.group !== "professional" && (
            <>
              <Text style={mentalStyles.label}>HOW CLOSE</Text>
              <View style={mentalStyles.chips}>
                {RINGS.map((ring) => (
                  <SelectionChip
                    key={ring.id}
                    label={ring.label}
                    color={color}
                    selected={active.ring === ring.id}
                    onPress={() => change(active.id, { ring: ring.id })}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      )}

      <View style={[mentalStyles.card, styles.detail]}>
        <Text style={styles.detailTitle}>I need…</Text>
        <View style={mentalStyles.chips}>
          {NEEDS.map((item) => (
            <SelectionChip
              key={item.id}
              icon={item.icon}
              label={item.label}
              color={color}
              selected={need === item.id}
              onPress={() => setNeed(need === item.id ? null : item.id)}
            />
          ))}
        </View>
        {need &&
          (matches.length ? (
            matches.map((member) => (
              <Text key={member.id} style={mentalStyles.body}>
                <AppIcon name={iconOf(member)} size={16} color={color} /> {displayName(member)}
              </Text>
            ))
          ) : (
            <Text style={mentalStyles.muted}>
              No one tagged for this yet. Tap someone in your circle to add it.
            </Text>
          ))}
      </View>

      <View style={[styles.pinned, { borderColor: color }]}>
        <Text style={[mentalStyles.label, { color }]}>PROFESSIONAL SUPPORT</Text>
        {professional.map((member) => (
          <Pressable
            key={member.id}
            accessibilityRole="button"
            onPress={() => setSelected(member.id === selected ? null : member.id)}
          >
            <Text style={mentalStyles.body}>
              <AppIcon name={iconOf(member)} size={16} color={color} /> {member.label}
            </Text>
          </Pressable>
        ))}
        <Text style={mentalStyles.muted}>{SAFETY}</Text>
      </View>

      <SecondaryButton label="Edit my circle" color={color} onPress={() => setStage("pick")} />
      <SavedOnDeviceNote
        what="support circle"
        onDelete={() => {
          clearMembers();
          setSelected(null);
          setStage("pick");
        }}
      />
      {exit}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  detail: { gap: 10 },
  detailTitle: { color: COLORS.ink, fontSize: 16, fontWeight: "800" },
  nudge: { padding: 14, borderRadius: 18, gap: 10 },
  circleWrap: { alignItems: "center", gap: 8 },
  me: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  meText: { color: COLORS.white, fontSize: 13, fontWeight: "800" },
  bubbleSlot: { position: "absolute", width: 72, alignItems: "center" },
  bubble: {
    width: BUBBLE,
    height: BUBBLE,
    borderRadius: BUBBLE / 2,
    borderWidth: 2,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleLabel: { marginTop: 2, color: COLORS.ink, fontSize: 10, fontWeight: "700" },
  pinned: { padding: 16, borderRadius: 18, borderWidth: 1.5, gap: 8, backgroundColor: COLORS.white },
});
