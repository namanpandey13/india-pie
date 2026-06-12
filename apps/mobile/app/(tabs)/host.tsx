import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState, type ComponentProps } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Loader, PrimaryButton, Screen, typographyRoles, useThemeColors } from '@hausy/ui';
import { useHostDraft } from '@/features/host/use-host-draft';

const categories = ['Sports', 'Party', 'Art', 'Tech', 'Food', 'Wellness'];
const prompts = [
  'What will people remember afterward?',
  'Who will feel most at home here?',
  'What makes this different from a usual night out?',
];

type PickerTarget = 'startDate' | 'startTime' | 'endDate' | 'endTime';

export default function HostScreen() {
  const colors = useThemeColors();
  const host = useHostDraft();
  const initialStart = parseDraftDate(host.startsAt);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('Art');
  const [requireApproval, setRequireApproval] = useState(true);
  const [price, setPrice] = useState<'Free' | 'Paid'>('Free');
  const [prompt, setPrompt] = useState(prompts[0]);
  const [promptAnswer, setPromptAnswer] = useState('');
  const [invitees, setInvitees] = useState('');
  const [startAt, setStartAt] = useState(initialStart);
  const [endAt, setEndAt] = useState(new Date(initialStart.getTime() + 60 * 60 * 1000));
  const [iosPicker, setIosPicker] = useState<PickerTarget | null>(null);

  const publish = () => host.publishHostDraft({
    template: category,
    startsAt: startAt.toISOString(),
    vibe: promptAnswer || host.vibe,
    visibility: host.visibility === 'curated' ? 'public' : host.visibility,
  });

  useEffect(() => {
    if (host.publishedEventId) {
      Alert.alert('Event published', 'Your event is now visible to other Hausy users.', [
        {
          text: 'View event',
          onPress: () => router.replace({ pathname: '/event/[id]', params: { id: host.publishedEventId as string } }),
        },
      ]);
    }
  }, [host.publishedEventId]);

  if (host.isLoadingDashboard) {
    return <Loader fill />;
  }

  const pickCover = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photo access needed', 'Allow photo access to choose an event cover.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: ['images'],
      quality: 0.82,
    });
    if (!result.canceled) {
      host.setCoverImageUrl(result.assets[0].uri);
    }
  };

  const updatePicker = (target: PickerTarget, value: Date) => {
    const current = target.startsWith('start') ? startAt : endAt;
    const next = new Date(current);
    if (target.endsWith('Date')) {
      next.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
    } else {
      next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    }
    if (target.startsWith('start')) {
      setStartAt(next);
      host.setStartsAt(next.toISOString());
      if (next >= endAt) setEndAt(new Date(next.getTime() + 60 * 60 * 1000));
    } else {
      setEndAt(next > startAt ? next : new Date(startAt.getTime() + 60 * 60 * 1000));
    }
  };

  const openPicker = (target: PickerTarget) => {
    const value = target.startsWith('start') ? startAt : endAt;
    const mode = target.endsWith('Date') ? 'date' : 'time';
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value,
        mode,
        is24Hour: false,
        minimumDate: target.endsWith('Date') ? new Date() : undefined,
        onChange: (_event, selected) => selected && updatePicker(target, selected),
      });
    } else {
      setIosPicker(target);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', default: undefined })} style={[styles.flex, { backgroundColor: colors.bg }]}>
      <Screen>
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.muted }]}>Create event</Text>
          <Text style={[styles.title, { color: colors.ink }]}>
            {step === 1 ? 'The essentials' : step === 2 ? 'Tickets and details' : 'Invite people'}
          </Text>
          <View style={styles.progress}>
            {[1, 2, 3].map((item) => <View key={item} style={[styles.progressBar, { backgroundColor: item <= step ? colors.ink : colors.line }]} />)}
          </View>
        </View>

        {step === 1 ? (
          <View style={styles.form}>
            <Pressable onPress={pickCover} style={[styles.coverPicker, { backgroundColor: colors.surfaceAlt }]}>
              {host.hostDraft.coverImageUrl ? (
                <>
                  <Image source={host.hostDraft.coverImageUrl} contentFit="cover" style={StyleSheet.absoluteFill} />
                  <View style={[styles.changeCover, { backgroundColor: colors.overlayMedium }]}>
                    <Ionicons name="image-outline" size={18} color={colors.white} />
                  </View>
                </>
              ) : <Ionicons name="image-outline" size={25} color={colors.muted} />}
            </Pressable>

            <LineField label="Event name" value={host.title} onChangeText={host.setTitle} />

            <View style={[styles.schedule, { borderColor: colors.line }]}>
              <ScheduleRow label="Start" value={startAt} onDate={() => openPicker('startDate')} onTime={() => openPicker('startTime')} />
              <View style={[styles.rowDivider, { backgroundColor: colors.line }]} />
              <ScheduleRow label="End" value={endAt} onDate={() => openPicker('endDate')} onTime={() => openPicker('endTime')} />
            </View>

            <LineField icon="location-outline" label="Location" value={host.location} onChangeText={host.setLocation} />
            <LineField icon="document-text-outline" label="Description" value={host.about} onChangeText={host.setAbout} multiline />
          </View>
        ) : null}

        {step === 2 ? (
          <View style={styles.form}>
            <ChoiceGroup label="Category" values={categories} selected={category} onSelect={setCategory} />

            <SettingSection label="Ticketing">
              <SettingRow icon="lock-closed-outline" label="Require approval">
                <Switch
                  value={requireApproval}
                  onValueChange={setRequireApproval}
                  trackColor={{ false: colors.line, true: colors.ink }}
                  thumbColor={colors.white}
                />
              </SettingRow>
              <SettingRow icon="ticket-outline" label="Price">
                <ValueToggle values={['Free', 'Paid']} selected={price} onSelect={(value) => setPrice(value as typeof price)} />
              </SettingRow>
            </SettingSection>

            <SettingSection label="Options">
              <SettingRow icon="globe-outline" label="Visibility">
                <ValueToggle values={['Public', 'Private']} selected={titleCase(host.visibility)} onSelect={(value) => host.setVisibility(value.toLowerCase() as 'public' | 'private')} />
              </SettingRow>
              <SettingRow icon="people-outline" label="Capacity">
                <TextInput
                  keyboardType="number-pad"
                  value={host.capacity === '0' ? '' : host.capacity}
                  onChangeText={(value) => host.setCapacity(value || '0')}
                  placeholder="Unlimited"
                  placeholderTextColor={colors.muted}
                  style={[styles.capacityInput, { color: colors.ink }]}
                />
              </SettingRow>
            </SettingSection>

            <Text style={[styles.groupLabel, { color: colors.ink }]}>Event prompt</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptRow}>
              {prompts.map((item) => (
                <Pressable key={item} onPress={() => setPrompt(item)} style={[styles.prompt, { borderColor: prompt === item ? colors.ink : colors.line }]}>
                  <Text style={[styles.promptText, { color: colors.ink }]}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <LineField label={prompt} value={promptAnswer} onChangeText={setPromptAnswer} multiline />
          </View>
        ) : null}

        {step === 3 ? (
          <View style={styles.form}>
            <View style={[styles.inviteHero, { backgroundColor: colors.surfaceAlt }]}>
              <Ionicons name="people-outline" size={28} color={colors.ink} />
              <Text style={[styles.inviteTitle, { color: colors.ink }]}>Invite people</Text>
            </View>
            <LineField label="Emails or usernames" value={invitees} onChangeText={setInvitees} multiline />
          </View>
        ) : null}

        {host.error ? <Text style={[styles.error, { color: colors.ink }]}>{host.error.message}</Text> : null}
        <View style={styles.footer}>
          {step > 1 ? <Pressable onPress={() => setStep((value) => value - 1)} style={styles.back}><Text style={[styles.backText, { color: colors.ink }]}>Back</Text></Pressable> : null}
          {step < 3 ? (
            <PrimaryButton label="Continue" icon="arrow-forward-outline" onPress={() => setStep((value) => value + 1)} style={styles.primary} />
          ) : (
            <>
              <Pressable onPress={publish} style={styles.skip}><Text style={[styles.backText, { color: colors.muted }]}>Skip</Text></Pressable>
              <PrimaryButton
                label={host.isPublishing ? 'Publishing...' : 'Publish'}
                loading={host.isPublishing}
                icon="send-outline"
                onPress={host.hostDraft.coverImageUrl && host.title.trim() && host.location.trim() ? publish : undefined}
                style={styles.primary}
              />
            </>
          )}
        </View>
      </Screen>

      {Platform.OS === 'ios' && iosPicker ? (
        <Modal transparent animationType="fade">
          <Pressable onPress={() => setIosPicker(null)} style={[styles.modalBackdrop, { backgroundColor: colors.overlayMedium }]}>
            <Pressable style={[styles.pickerSheet, { backgroundColor: colors.surface }]}>
              <View style={styles.pickerHeader}>
                <Text style={[styles.groupLabel, { color: colors.ink }]}>{iosPicker.startsWith('start') ? 'Start' : 'End'}</Text>
                <Pressable onPress={() => setIosPicker(null)}><Text style={[styles.done, { color: colors.ink }]}>Done</Text></Pressable>
              </View>
              <DateTimePicker
                display={iosPicker.endsWith('Date') ? 'inline' : 'spinner'}
                mode={iosPicker.endsWith('Date') ? 'date' : 'time'}
                minimumDate={iosPicker.endsWith('Date') ? new Date() : undefined}
                value={iosPicker.startsWith('start') ? startAt : endAt}
                onChange={(_event, selected) => selected && updatePicker(iosPicker, selected)}
              />
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </KeyboardAvoidingView>
  );
}

function LineField({ label, icon, multiline, ...props }: ComponentProps<typeof TextInput> & { label: string; icon?: keyof typeof Ionicons.glyphMap }) {
  const colors = useThemeColors();
  return (
    <View style={[styles.lineField, { borderColor: colors.line }]}>
      {icon ? <Ionicons name={icon} size={19} color={colors.muted} /> : null}
      <TextInput
        {...props}
        multiline={multiline}
        placeholder={label}
        placeholderTextColor={colors.muted}
        style={[styles.input, multiline && styles.textArea, { color: colors.ink }]}
      />
    </View>
  );
}

function ScheduleRow({ label, value, onDate, onTime }: { label: string; value: Date; onDate: () => void; onTime: () => void }) {
  const colors = useThemeColors();
  return (
    <View style={styles.scheduleRow}>
      <Text style={[styles.scheduleLabel, { color: colors.ink }]}>{label}</Text>
      <Pressable onPress={onDate} style={[styles.dateButton, { backgroundColor: colors.surfaceAlt }]}>
        <Text style={[styles.dateText, { color: colors.ink }]}>{formatDate(value)}</Text>
      </Pressable>
      <Pressable onPress={onTime} style={[styles.dateButton, { backgroundColor: colors.surfaceAlt }]}>
        <Text style={[styles.dateText, { color: colors.ink }]}>{formatTime(value)}</Text>
      </Pressable>
    </View>
  );
}

function SettingSection({ label, children }: { label: string; children: React.ReactNode }) {
  const colors = useThemeColors();
  return (
    <View style={styles.settingSection}>
      <Text style={[styles.groupLabel, { color: colors.ink }]}>{label}</Text>
      <View style={[styles.settingGroup, { borderColor: colors.line }]}>{children}</View>
    </View>
  );
}

function SettingRow({ icon, label, children }: { icon: keyof typeof Ionicons.glyphMap; label: string; children: React.ReactNode }) {
  const colors = useThemeColors();
  return (
    <View style={[styles.settingRow, { borderColor: colors.line }]}>
      <Ionicons name={icon} size={19} color={colors.muted} />
      <Text style={[styles.settingLabel, { color: colors.ink }]}>{label}</Text>
      {children}
    </View>
  );
}

function ValueToggle({ values, selected, onSelect }: { values: string[]; selected: string; onSelect: (value: string) => void }) {
  const colors = useThemeColors();
  return (
    <View style={styles.valueToggle}>
      {values.map((value) => (
        <Pressable key={value} onPress={() => onSelect(value)} style={[styles.valueChoice, selected === value && { backgroundColor: colors.ink }]}>
          <Text style={[styles.valueText, { color: selected === value ? colors.bg : colors.muted }]}>{value}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function ChoiceGroup({ label, values, selected, onSelect }: { label: string; values: string[]; selected: string; onSelect: (value: string) => void }) {
  const colors = useThemeColors();
  return (
    <View style={styles.choiceGroup}>
      <Text style={[styles.groupLabel, { color: colors.ink }]}>{label}</Text>
      <View style={styles.choices}>
        {values.map((value) => (
          <Pressable key={value} onPress={() => onSelect(value)} style={[styles.choice, { backgroundColor: selected === value ? colors.ink : colors.surfaceAlt }]}>
            <Text style={[styles.choiceText, { color: selected === value ? colors.bg : colors.ink }]}>{value}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function parseDraftDate(value: string) {
  const parsed = value ? new Date(value) : new Date(Date.now() + 24 * 60 * 60 * 1000);
  if (Number.isNaN(parsed.getTime())) return new Date(Date.now() + 24 * 60 * 60 * 1000);
  parsed.setSeconds(0, 0);
  return parsed;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', weekday: 'short' }).format(value);
}

function formatTime(value: Date) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(value);
}

function titleCase(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { gap: 10, paddingTop: 8 },
  eyebrow: { ...typographyRoles.caption },
  title: { ...typographyRoles.h1 },
  progress: { flexDirection: 'row', gap: 6, paddingTop: 8 },
  progressBar: { borderRadius: 99, flex: 1, height: 3 },
  form: { gap: 20 },
  coverPicker: { alignItems: 'center', borderRadius: 20, height: 154, justifyContent: 'center', overflow: 'hidden' },
  changeCover: { alignItems: 'center', borderRadius: 999, bottom: 12, height: 38, justifyContent: 'center', position: 'absolute', right: 12, width: 38 },
  lineField: { alignItems: 'flex-start', borderBottomWidth: 1, flexDirection: 'row', gap: 10 },
  input: { ...typographyRoles.bodyStrong, flex: 1, minHeight: 52, paddingVertical: 12 },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  schedule: { borderBottomWidth: 1, borderTopWidth: 1, paddingVertical: 5 },
  scheduleRow: { alignItems: 'center', flexDirection: 'row', gap: 8, minHeight: 58 },
  scheduleLabel: { ...typographyRoles.label, flex: 1 },
  dateButton: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  dateText: { ...typographyRoles.caption },
  rowDivider: { height: StyleSheet.hairlineWidth, marginLeft: 54 },
  choiceGroup: { gap: 10 },
  groupLabel: { ...typographyRoles.h3 },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choice: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9 },
  choiceText: { ...typographyRoles.caption },
  settingSection: { gap: 10 },
  settingGroup: { borderBottomWidth: 1, borderTopWidth: 1 },
  settingRow: { alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: 11, minHeight: 60 },
  settingLabel: { ...typographyRoles.bodyStrong, flex: 1 },
  valueToggle: { flexDirection: 'row', gap: 3 },
  valueChoice: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  valueText: { ...typographyRoles.caption },
  capacityInput: { ...typographyRoles.bodyStrong, minWidth: 90, paddingVertical: 10, textAlign: 'right' },
  promptRow: { gap: 10, paddingRight: 18 },
  prompt: { borderRadius: 18, borderWidth: 1, padding: 15, width: 220 },
  promptText: { ...typographyRoles.bodyStrong },
  inviteHero: { alignItems: 'center', borderRadius: 22, gap: 10, padding: 28 },
  inviteTitle: { ...typographyRoles.h2 },
  error: { ...typographyRoles.caption, textAlign: 'center' },
  footer: { alignItems: 'center', flexDirection: 'row', gap: 12, paddingBottom: 20 },
  primary: { flex: 1 },
  back: { paddingHorizontal: 8, paddingVertical: 14 },
  skip: { paddingVertical: 14 },
  backText: { ...typographyRoles.label },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end' },
  pickerSheet: { borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 18 },
  pickerHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  done: { ...typographyRoles.label, padding: 8 },
});
