import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  Card,
  colors,
  GhostButton,
  Header,
  Pill,
  PrimaryButton,
  Screen,
  SectionTitle,
  TopBar,
} from '@hausy/ui';
import { useHostDraft } from '@/features/host/use-host-draft';

export default function HostScreen() {
  const {
    capacity,
    draft,
    setCapacity,
    setTemplate,
    setTitle,
    setVisibility,
    template,
    templates,
    title,
    visibility,
  } = useHostDraft();

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', default: undefined })}
      style={styles.flex}>
      <Screen>
        <TopBar />
        <Header
          eyebrow="creator mode"
          title="host like a creator, not a random listing."
          subtitle="The aligned wedge: host reputation, guest selection, clear follow-through, and chat inside the product."
        />

        <SectionTitle title="start with a format" />
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
          <Text style={styles.label}>plan title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Name your plan"
            placeholderTextColor={colors.faint}
            style={styles.input}
          />

          <Text style={styles.label}>where</Text>
          <View style={styles.inputRow}>
            <Ionicons name="location-outline" size={20} color={colors.lime} />
            <Text style={styles.inputStatic}>Khan Market, Hauz Khas, Cyber Hub</Text>
          </View>

          <View style={styles.twoCol}>
            <View style={styles.fieldHalf}>
              <Text style={styles.label}>when</Text>
              <View style={styles.inputRow}>
                <Ionicons name="time-outline" size={18} color={colors.lime} />
                <Text style={styles.inputStatic}>Thu, 7 PM</Text>
              </View>
            </View>
            <View style={styles.fieldHalf}>
              <Text style={styles.label}>capacity</Text>
              <TextInput
                keyboardType="number-pad"
                value={capacity}
                onChangeText={setCapacity}
                style={styles.input}
              />
            </View>
          </View>
        </Card>

        <SectionTitle title="guest list control" action="trust layer" />
        <Card style={styles.visibilityCard}>
          <OptionRow
            active={visibility === 'public'}
            title="public"
            body="Anyone in Delhi NCR can request to join."
            onPress={() => setVisibility('public')}
          />
          <OptionRow
            active={visibility === 'curated'}
            title="curated"
            body="You approve guests by LinkedIn, Instagram, age range, vibe, and mutual context."
            onPress={() => setVisibility('curated')}
          />
          <OptionRow
            active={visibility === 'private'}
            title="private"
            body="Only people with the invite link can see the plan."
            onPress={() => setVisibility('private')}
          />
        </Card>

        <SectionTitle title="host follow-through" action="no dead events" />
        <Card style={styles.promptCard}>
          <Checklist label="Confirm venue before publishing" done />
          <Checklist label="Send route or table proof 3 hours before" done />
          <Checklist label="Open pre-event chat with prompts" done />
          <Checklist label="Post-event host review affects creator rank" done />
        </Card>

        <SectionTitle title="guest fit questions" action="pre-chat seed" />
        <Card style={styles.promptCard}>
          <Text style={styles.prompt}>- What brings you to this plan?</Text>
          <Text style={styles.prompt}>- Are you coming solo or with a friend?</Text>
          <Text style={styles.prompt}>- What would make this feel worth leaving home for?</Text>
          <GhostButton label="edit prompts" icon="pencil-outline" />
        </Card>

        <PrimaryButton label={`Save ${draft.status}`} icon="document-text-outline" tone="blue" />
        <PrimaryButton label="Preview and publish" icon="send-outline" />
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
  return (
    <Pressable style={[styles.option, active && styles.optionActive]} onPress={onPress}>
      <Ionicons
        name={active ? 'radio-button-on' : 'radio-button-off'}
        size={22}
        color={active ? colors.lime : colors.muted}
      />
      <View style={styles.optionCopy}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionBody}>{body}</Text>
      </View>
    </Pressable>
  );
}

function Checklist({ label, done }: { label: string; done?: boolean }) {
  return (
    <View style={styles.checkRow}>
      <Ionicons name={done ? 'checkmark-circle' : 'ellipse-outline'} size={19} color={colors.lime} />
      <Text style={styles.checkText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.bg,
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
    color: colors.faint,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  inputRow: {
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  inputStatic: {
    color: colors.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
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
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  optionActive: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.lime,
  },
  optionCopy: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  optionBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  promptCard: {
    gap: 10,
  },
  prompt: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  checkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  checkText: {
    color: colors.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
});
