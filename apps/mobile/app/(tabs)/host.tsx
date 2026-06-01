import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  Card,
  GhostButton,
  Header,
  Pill,
  PrimaryButton,
  Screen,
  SectionTitle,
  TopBar,
  typographyRoles,
  useThemeColors,
} from '@hausy/ui';
import { useHostDraft } from '@/features/host/use-host-draft';

export default function HostScreen() {
  const colors = useThemeColors();
  const {
    capacity,
    draft,
    hostDraft,
    saveHostDraft,
    setCapacity,
    setTemplate,
    setTitle,
    setVisibility,
    submitHostDraftForReview,
    template,
    templates,
    title,
    visibility,
  } = useHostDraft();

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', default: undefined })}
      style={[styles.flex, { backgroundColor: colors.bg }]}>
      <Screen>
        <TopBar onChatPress={() => router.push('/chat')} onNotificationPress={() => router.push('/modal')} />
        <Header
          eyebrow="creator studio"
          title="Create offline plans like a trusted creator."
          subtitle="Submit a plan with venue proof, guest fit, and creator accountability. Hausy reviews plans before they enter planning."
        />

        <SectionTitle title="Start with a format" />
        <View style={styles.templateGrid}>
          {templates.map((item) => (
            <Pill
              key={item}
              label={item}
              active={item === template}
              onPress={() => setTemplate(item)}
              tone={item === 'builders dinner' ? 'yellow' : 'lime'}
            />
          ))}
        </View>

        <Card style={styles.formCard}>
          <Text style={[styles.label, { color: colors.faint }]}>Plan title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Name your plan"
            placeholderTextColor={colors.faint}
            style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.line, color: colors.ink }]}
          />

          <Text style={[styles.label, { color: colors.faint }]}>Where</Text>
          <View style={[styles.inputRow, { backgroundColor: colors.surfaceAlt, borderColor: colors.line }]}>
            <Ionicons name="location-outline" size={20} color={colors.brand} />
            <Text style={[styles.inputStatic, { color: colors.ink }]}>Choose or propose a venue</Text>
          </View>

          <View style={styles.twoCol}>
            <View style={styles.fieldHalf}>
              <Text style={[styles.label, { color: colors.faint }]}>When</Text>
              <View style={[styles.inputRow, { backgroundColor: colors.surfaceAlt, borderColor: colors.line }]}>
                <Ionicons name="time-outline" size={18} color={colors.brand} />
                <Text style={[styles.inputStatic, { color: colors.ink }]}>Add event session</Text>
              </View>
            </View>
            <View style={styles.fieldHalf}>
              <Text style={[styles.label, { color: colors.faint }]}>Capacity</Text>
              <TextInput
                keyboardType="number-pad"
                value={capacity}
                onChangeText={setCapacity}
                style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.line, color: colors.ink }]}
              />
            </View>
          </View>
        </Card>

        <SectionTitle title="Guest list control" action="Trust layer" />
        <Card style={styles.visibilityCard}>
          <OptionRow
            active={visibility === 'public'}
            title="Public"
            body="Anyone in the launch region can request to join."
            onPress={() => setVisibility('public')}
          />
          <OptionRow
            active={visibility === 'curated'}
            title="Curated"
            body="You approve guests by LinkedIn, Instagram, age range, vibe, and mutual context."
            onPress={() => setVisibility('curated')}
          />
          <OptionRow
            active={visibility === 'private'}
            title="Private"
            body="Only people with the invite link can see the plan."
            onPress={() => setVisibility('private')}
          />
        </Card>

        <SectionTitle title="Creator follow-through" action="Review required" />
        <Card style={styles.promptCard}>
          <Checklist label="Confirm venue before review" done />
          <Checklist label="Share route or table proof before event" done />
          <Checklist label="Keep plan updates inside Hausy Plan Inbox" done />
          <Checklist label="Post-event reviews affect creator rank" done />
        </Card>

        <SectionTitle title="Guest fit questions" action="Pre-chat seed" />
        <Card style={styles.promptCard}>
          <Text style={[styles.prompt, { color: colors.muted }]}>What brings you to this plan?</Text>
          <Text style={[styles.prompt, { color: colors.muted }]}>Are you coming solo or with a friend?</Text>
          <Text style={[styles.prompt, { color: colors.muted }]}>What would make this feel worth leaving home for?</Text>
          <GhostButton label="Edit prompts" icon="pencil-outline" onPress={saveHostDraft} />
        </Card>

        {hostDraft.lastSavedAt ? <Text style={[styles.savedStatus, { color: colors.brand }]}>{hostDraft.lastSavedAt}</Text> : null}
        {hostDraft.submittedForReview ? (
          <Card style={styles.previewCard}>
            <Text style={[styles.previewTitle, { color: colors.ink }]}>{title}</Text>
            <Text style={[styles.previewBody, { color: colors.muted }]}>
              {template} - {visibility} - {capacity} guests. The plan is in review before it can move to planning.
            </Text>
          </Card>
        ) : null}
        <PrimaryButton
          label={`Save ${draft?.status ?? 'draft'}`}
          icon="document-text-outline"
          tone="blue"
          onPress={saveHostDraft}
        />
        <PrimaryButton label="Submit for review" icon="send-outline" onPress={submitHostDraftForReview} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

function OptionRow({
  active,
  title,
  body,
  onPress,
}: {
  active: boolean;
  title: string;
  body: string;
  onPress: () => void;
}) {
  const colors = useThemeColors();

  return (
    <Pressable
      style={[
        styles.option,
        { borderColor: colors.line },
        active && { backgroundColor: colors.surfaceAlt, borderColor: colors.brand },
      ]}
      onPress={onPress}>
      <Ionicons
        name={active ? 'radio-button-on' : 'radio-button-off'}
        size={22}
        color={active ? colors.brand : colors.muted}
      />
      <View style={styles.optionCopy}>
        <Text style={[styles.optionTitle, { color: colors.ink }]}>{title}</Text>
        <Text style={[styles.optionBody, { color: colors.muted }]}>{body}</Text>
      </View>
    </Pressable>
  );
}

function Checklist({ label, done }: { label: string; done?: boolean }) {
  const colors = useThemeColors();

  return (
    <View style={styles.checkRow}>
      <Ionicons name={done ? 'checkmark-circle' : 'ellipse-outline'} size={19} color={colors.brand} />
      <Text style={[styles.checkText, { color: colors.ink }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  formCard: {
    gap: 12,
  },
  label: {
    ...typographyRoles.caption,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    ...typographyRoles.bodyStrong,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  inputRow: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  inputStatic: {
    flex: 1,
    ...typographyRoles.bodyStrong,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldHalf: {
    flex: 1,
    gap: 8,
  },
  visibilityCard: {
    gap: 10,
  },
  option: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  optionActive: {
  },
  optionCopy: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    ...typographyRoles.label,
  },
  optionBody: {
    ...typographyRoles.caption,
  },
  promptCard: {
    gap: 10,
  },
  prompt: {
    ...typographyRoles.body,
  },
  checkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  checkText: {
    flex: 1,
    ...typographyRoles.bodyStrong,
  },
  savedStatus: {
    ...typographyRoles.caption,
    textAlign: 'center',
  },
  previewCard: {
    gap: 8,
  },
  previewTitle: {
    ...typographyRoles.h3,
  },
  previewBody: {
    ...typographyRoles.body,
  },
});
