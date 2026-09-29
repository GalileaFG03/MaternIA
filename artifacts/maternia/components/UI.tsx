import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export function Screen({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const content = <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 92 }]}>{children}</View>;
  return scroll ? <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>{content}</ScrollView> : content;
}

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();
  const colors = useColors();
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" testID="back-button" onPress={() => router.back()} style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.card }, pressed && styles.pressed]}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </Pressable>
      <View style={styles.headerCopy}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

export function BrandMark({ size = 58 }: { size?: number }) {
  return <Image source={require('../assets/images/icon.png')} style={{ width: size, height: size, borderRadius: size * 0.28 }} resizeMode="contain" />;
}

export function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, icon }: { title: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; loading?: boolean; disabled?: boolean; icon?: keyof typeof Ionicons.glyphMap }) {
  const colors = useColors();
  const palette = variant === 'primary'
    ? { backgroundColor: colors.mintDark, color: colors.white, borderColor: colors.mintDark }
    : variant === 'secondary'
      ? { backgroundColor: colors.lilac, color: colors.text, borderColor: colors.lilac }
      : variant === 'outline'
        ? { backgroundColor: 'transparent', color: colors.mintDark, borderColor: colors.mintDark }
        : { backgroundColor: 'transparent', color: colors.lilacDark, borderColor: 'transparent' };
  return (
    <Pressable accessibilityRole="button" testID={`button-${title}`} disabled={disabled || loading} onPress={onPress} style={({ pressed }) => [styles.button, palette, (disabled || loading) && styles.disabled, pressed && styles.pressed]}>
      {loading ? <ActivityIndicator color={palette.color} /> : <>{icon ? <Ionicons name={icon} size={18} color={palette.color} style={styles.buttonIcon} /> : null}<Text style={[styles.buttonText, { color: palette.color }]}>{title}</Text></>}
    </Pressable>
  );
}

export function Input({ label, ...props }: { label: string } & TextInputProps) {
  const colors = useColors();
  return (
    <View style={styles.inputWrap}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput placeholderTextColor={colors.mutedForeground} {...props} style={[styles.input, { color: colors.text, backgroundColor: colors.white, borderColor: colors.border }]} />
    </View>
  );
}

export function Card({ children, onPress, tone = 'card', style }: { children: React.ReactNode; onPress?: () => void; tone?: 'card' | 'lilac' | 'mint' | 'beige'; style?: object }) {
  const colors = useColors();
  const backgroundColor = tone === 'lilac' ? colors.lilac : tone === 'mint' ? colors.mint : tone === 'beige' ? colors.beige : colors.card;
  const content = <View style={[styles.card, { backgroundColor }, style]}>{children}</View>;
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>{content}</Pressable> : content;
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return <View style={styles.sectionRow}><Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>{action && onAction ? <Pressable onPress={onAction}><Text style={[styles.action, { color: colors.mintDark }]}>{action}</Text></Pressable> : null}</View>;
}

export function EmptyState({ icon, title, text }: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string }) {
  const colors = useColors();
  return <View style={styles.empty}><Ionicons name={icon} size={32} color={colors.lilacDark} /><Text style={[styles.emptyTitle, { color: colors.text }]}>{title}</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{text}</Text></View>;
}

export function ScorePill({ score, type }: { score: number; type: 'phq9' | 'epds' }) {
  const colors = useColors();
  const high = type === 'phq9' ? score >= 15 : score >= 13;
  const medium = type === 'phq9' ? score >= 5 : score >= 10;
  const color = high ? colors.destructive : medium ? '#C49B45' : colors.mintDark;
  const label = high ? 'Requiere atención' : medium ? 'Moderado' : 'Bajo';
  return <View style={[styles.pill, { backgroundColor: `${color}22` }]}><View style={[styles.dot, { backgroundColor: color }]} /><Text style={[styles.pillText, { color }]}>{label} · {score}</Text></View>;
}

export const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20 },
  scroll: { flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 22 },
  headerCopy: { flex: 1 },
  headerTitle: { fontSize: 25, fontWeight: '700' },
  headerSubtitle: { fontSize: 13, marginTop: 3 },
  iconButton: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#3A3A3A', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  brandTitle: { fontSize: 33, fontWeight: '700', letterSpacing: -0.7 },
  body: { fontSize: 15, lineHeight: 22 },
  button: { minHeight: 52, borderRadius: 26, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 22, marginTop: 12 },
  buttonText: { fontSize: 15, fontWeight: '700' },
  buttonIcon: { marginRight: 8 },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
  inputWrap: { marginBottom: 13 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 7 },
  input: { minHeight: 50, borderWidth: 1, borderRadius: 15, paddingHorizontal: 15, fontSize: 15 },
  card: { borderRadius: 20, padding: 17, marginBottom: 13, shadowColor: '#3A3A3A', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 17, marginBottom: 11 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  action: { fontSize: 13, fontWeight: '700' },
  empty: { alignItems: 'center', padding: 28, borderRadius: 20, backgroundColor: '#FFFFFF' },
  emptyTitle: { fontWeight: '700', fontSize: 16, marginTop: 10 },
  emptyText: { textAlign: 'center', lineHeight: 20, marginTop: 5 },
  pill: { borderRadius: 14, paddingHorizontal: 10, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  pillText: { fontWeight: '700', fontSize: 12 },
});