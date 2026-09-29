import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Linking,
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import {
  Appointment,
  CheckIn,
  Post,
  ScoreRecord,
  Stage,
  User,
} from '@/context/AppContext';
import { healthKitService } from '@/services/healthKitService';
import { readJson, storageKeys, writeJson } from '@/services/storage';
import {
  BrandMark,
  Button,
  Card,
  EmptyState,
  Header,
  Input,
  Screen,
  ScorePill,
  SectionTitle,
  styles,
} from '@/components/UI';

const moodOptions = [
  { emoji: '😊', label: 'Muy bien' },
  { emoji: '🙂', label: 'Bien' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😔', label: 'Triste' },
  { emoji: '😣', label: 'Difícil' },
];

const quickActions: Array<{ title: string; icon: keyof typeof Ionicons.glyphMap; route: string; tone: 'mint' | 'lilac' | 'beige' | 'card' }> = [
  { title: 'Check-in diario', icon: 'heart', route: '/check-in', tone: 'mint' },
  { title: 'Mi bienestar', icon: 'sparkles', route: '/wellbeing', tone: 'lilac' },
  { title: 'Autocuidado', icon: 'leaf', route: '/selfcare', tone: 'beige' },
  { title: 'Especialistas', icon: 'location', route: '/map', tone: 'card' },
  { title: 'Mis citas', icon: 'calendar', route: '/appointments', tone: 'card' },
  { title: 'Recursos', icon: 'book', route: '/resources', tone: 'lilac' },
  { title: 'Apple Salud', icon: 'watch', route: '/health', tone: 'mint' },
  { title: 'Configuración', icon: 'settings', route: '/settings', tone: 'card' },
];

const phqQuestions = [
  'Poco interés o placer en hacer las cosas',
  'Sentirse decaída, deprimida o sin esperanza',
  'Dificultad para dormir o dormir demasiado',
  'Sentirse cansada o con poca energía',
  'Falta de apetito o comer en exceso',
  'Sentirse mal consigo misma',
  'Dificultad para concentrarse',
  'Moverse o hablar lento, o estar inquieta',
  'Pensamientos de muerte o autolesión',
];

const epdsQuestions = [
  'He podido reír y ver el lado divertido de las cosas',
  'He mirado el futuro con placer',
  'Me he culpado sin necesidad cuando las cosas salían mal',
  'Me he sentido ansiosa o preocupada sin motivo',
  'He sentido miedo o pánico sin motivo',
  'Las cosas me han agobiado',
  'Me he sentido tan infeliz que he tenido dificultad para dormir',
  'Me he sentido triste o desgraciada',
  'Me he sentido tan infeliz que he estado llorando',
  'Se me ha ocurrido la idea de hacerme daño',
];

const options = ['Nunca', 'Algunos días', 'Más de la mitad', 'Casi todos'];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function SplashView() {
  const router = useRouter();
  const { user, stage, hydrated } = useApp();
  const colors = useColors();
  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => router.replace(user && stage ? '/(tabs)' : '/login'), 2000);
    return () => clearTimeout(timer);
  }, [hydrated, user, stage, router]);
  return (
    <View style={{ flex: 1, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 }}>
      <BrandMark size={190} />
      <Text style={[styles.brandTitle, { color: colors.text, marginTop: 16 }]}>MaternIA</Text>
      <Text style={{ color: colors.text, textAlign: 'center', fontSize: 16, marginTop: 7 }}>Acompañándote en cada etapa de la maternidad.</Text>
    </View>
  );
}

export function LoginView() {
  const router = useRouter();
  const { setUser } = useApp();
  const colors = useColors();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const submit = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Completa tus datos', 'Necesitamos tu nombre, correo y contraseña para continuar.');
      return;
    }
    await setUser({ name: name.trim(), email: email.trim() });
    router.replace('/stage');
  };
  return (
    <Screen>
      <View style={{ alignItems: 'center', marginTop: 22, marginBottom: 16 }}>
        <BrandMark size={112} />
        <Text style={[styles.brandTitle, { color: colors.text, marginTop: 8 }]}>Bienvenida a MaternIA</Text>
        <Text style={{ color: colors.mutedForeground, marginTop: 5 }}>Tu bienestar es importante</Text>
      </View>
      <Input label="Nombre" value={name} onChangeText={setName} placeholder="¿Cómo te gusta que te llamemos?" autoCapitalize="words" />
      <Input label="Correo electrónico" value={email} onChangeText={setEmail} placeholder="tu@correo.com" keyboardType="email-address" autoCapitalize="none" />
      <View>
        <Input label="Contraseña" value={password} onChangeText={setPassword} placeholder="Tu contraseña" secureTextEntry={secure} />
        <Pressable onPress={() => setSecure((value) => !value)} style={{ position: 'absolute', right: 15, bottom: 28 }}>
          <Ionicons name={secure ? 'eye-outline' : 'eye-off-outline'} size={21} color={colors.mutedForeground} />
        </Pressable>
      </View>
      <Button title="Iniciar sesión" onPress={submit} icon="arrow-forward" />
      <Button title="Crear cuenta" variant="outline" onPress={() => router.push('/register')} />
      <Pressable onPress={() => Alert.alert('Recuperar contraseña', 'En una próxima versión podremos ayudarte a recuperar tu acceso.')} style={{ alignItems: 'center', marginTop: 18 }}>
        <Text style={{ color: colors.lilacDark, fontWeight: '700' }}>¿Olvidaste tu contraseña?</Text>
      </Pressable>
    </Screen>
  );
}

export function RegisterView() {
  const router = useRouter();
  const { setUser } = useApp();
  const colors = useColors();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async () => {
    if (Object.values(form).some((value) => !value.trim())) {
      Alert.alert('Completa tus datos', 'Todos los campos son necesarios.');
    } else if (form.password !== form.confirm) {
      Alert.alert('Revisa tu contraseña', 'Las contraseñas no coinciden.');
    } else {
      await setUser({ name: form.name.trim(), email: form.email.trim() });
      router.replace('/stage');
    }
  };
  return (
    <Screen>
      <Header title="Crear cuenta" />
      <View style={{ alignItems: 'center', marginBottom: 14 }}><BrandMark size={88} /></View>
      <Text style={[styles.body, { color: colors.mutedForeground, marginBottom: 18 }]}>Crea un espacio solo para ti, con herramientas para acompañarte con calma.</Text>
      <Input label="Nombre" value={form.name} onChangeText={(value) => update('name', value)} placeholder="Tu nombre" />
      <Input label="Correo electrónico" value={form.email} onChangeText={(value) => update('email', value)} placeholder="tu@correo.com" keyboardType="email-address" autoCapitalize="none" />
      <Input label="Contraseña" value={form.password} onChangeText={(value) => update('password', value)} placeholder="Crea una contraseña" secureTextEntry />
      <Input label="Confirmar contraseña" value={form.confirm} onChangeText={(value) => update('confirm', value)} placeholder="Repite tu contraseña" secureTextEntry />
      <Button title="Registrarme" onPress={submit} icon="heart-outline" />
      <Button title="Ya tengo cuenta" variant="outline" onPress={() => router.back()} />
    </Screen>
  );
}

export function StageView() {
  const router = useRouter();
  const { setStage } = useApp();
  const colors = useColors();
  const [selected, setSelected] = useState<Stage | null>(null);
  const continueToApp = async () => {
    if (!selected) return Alert.alert('Elige una etapa', 'Así podemos adaptar mejor tu experiencia.');
    await setStage(selected);
    router.replace('/(tabs)');
  };
  return (
    <Screen>
      <View style={{ marginTop: 34, marginBottom: 24 }}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Cuéntanos un poquito sobre ti</Text>
        <Text style={[styles.body, { color: colors.mutedForeground, marginTop: 7 }]}>Esto nos ayudará a adaptar tu experiencia.</Text>
      </View>
      {([
        ['embarazo', 'Estoy esperando a mi bebé.', 'woman-outline', 'Durante el embarazo'],
        ['posparto', 'Mi bebé ya nació.', 'happy-outline', 'En posparto'],
      ] as const).map(([value, description, icon, title]) => {
        const active = selected === value;
        return (
          <Pressable key={value} onPress={() => setSelected(value)} style={({ pressed }) => [styles.card, { backgroundColor: active ? colors.mint : colors.card, borderWidth: 2, borderColor: active ? colors.mintDark : 'transparent' }, pressed && styles.pressed]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: active ? colors.white : colors.beige, alignItems: 'center', justifyContent: 'center' }}><Ionicons name={icon} size={27} color={colors.mintDark} /></View>
              <View style={{ flex: 1 }}><Text style={{ color: colors.text, fontWeight: '700', fontSize: 17 }}>{title}</Text><Text style={{ color: colors.mutedForeground, marginTop: 4 }}>{description}</Text></View>
              <Ionicons name={active ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={active ? colors.mintDark : colors.border} />
            </View>
          </Pressable>
        );
      })}
      <Button title="Continuar" onPress={continueToApp} disabled={!selected} icon="arrow-forward" />
    </Screen>
  );
}

export function HomeView() {
  const router = useRouter();
  const { user } = useApp();
  const colors = useColors();
  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
        <BrandMark size={58} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>Hola, {user?.name || 'mamá'} 💗</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 16, marginTop: 4 }}>¿Cómo te sientes hoy?</Text>
        </View>
      </View>
      <Card tone="lilac" style={{ padding: 20, marginBottom: 20 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', lineHeight: 23, textAlign: 'center' }}>Recuerda: no tienes que pasar por esto sola.</Text>
      </Card>
      <SectionTitle title="Accesos rápidos" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {quickActions.map((item, index) => <Card key={item.title} tone={item.tone} onPress={() => router.push(item.route as never)} style={[{ width: '48%', minHeight: 120, padding: 16, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }, index === 7 && { backgroundColor: colors.muted }]}>
          <Ionicons name={item.icon} size={32} color={colors.lilacDark} />
          <Text numberOfLines={2} ellipsizeMode="tail" style={{ color: colors.text, fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 10 }}>{item.title}</Text>
        </Card>)}
      </View>
    </Screen>
  );
}

export function CheckInView() {
  const router = useRouter();
  const colors = useColors();
  const [mood, setMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const save = async () => {
    if (mood === null) return Alert.alert('Elige cómo te sientes', 'Selecciona una opción para guardar tu check-in.');
    const records = await readJson<CheckIn[]>(storageKeys.checkins, []);
    await writeJson(storageKeys.checkins, [{ date: new Date().toISOString(), mood, note: note.trim() }, ...records]);
    Alert.alert('Guardado', 'Tu check-in quedó registrado. Gracias por compartirlo.', [{ text: 'Listo', onPress: () => router.back() }]);
  };
  return <Screen><Header title="¿Cómo te sientes hoy?" subtitle="Un registro breve para escucharte" /><Text style={[styles.body, { color: colors.mutedForeground, marginBottom: 15 }]}>Tómate un momento para elegir la emoción que más se parece a tu día.</Text><View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 }}>{moodOptions.map((item, index) => <Pressable key={item.label} onPress={() => setMood(index)} style={{ alignItems: 'center' }}><View style={{ width: 54, height: 54, borderRadius: 18, borderWidth: 2, borderColor: mood === index ? colors.mintDark : 'transparent', backgroundColor: mood === index ? colors.mint : colors.card, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 28 }}>{item.emoji}</Text></View><Text style={{ fontSize: 10, color: colors.mutedForeground, marginTop: 5 }}>{item.label}</Text></Pressable>)}</View><Input label="¿Quieres contarnos algo sobre tu día?" value={note} onChangeText={setNote} placeholder="Escribe lo que necesites..." multiline numberOfLines={5} textAlignVertical="top" /><Button title="Guardar check-in" onPress={save} icon="checkmark" /><Button title="Ver historial emocional" variant="outline" onPress={() => router.push('/history')} /></Screen>;
}

export function HistoryView() {
  const colors = useColors();
  const [records, setRecords] = useState<CheckIn[]>([]);
  useFocusEffect(React.useCallback(() => { readJson<CheckIn[]>(storageKeys.checkins, []).then(setRecords); }, []));
  return <Screen><Header title="Historial emocional" /><Text style={[styles.body, { color: colors.mutedForeground, marginBottom: 15 }]}>Llevas {records.length} {records.length === 1 ? 'día' : 'días'} registrando cómo te sientes.</Text>{records.length === 0 ? <EmptyState icon="heart-outline" title="Aún no tienes registros" text="Tu primer check-in aparecerá aquí." /> : records.map((record) => <Card key={record.date}><View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ fontSize: 32 }}>{moodOptions[record.mood]?.emoji}</Text><View style={{ marginLeft: 12, flex: 1 }}><Text style={{ color: colors.text, fontWeight: '700' }}>{moodOptions[record.mood]?.label}</Text><Text style={{ color: colors.mutedForeground, marginTop: 3 }}>{formatDate(record.date)}</Text></View></View>{record.note ? <Text style={{ color: colors.text, marginTop: 13, lineHeight: 20 }}>{record.note}</Text> : null}</Card>)}</Screen>;
}

function QuestionnaireView({ type }: { type: 'phq9' | 'epds' }) {
  const router = useRouter();
  const colors = useColors();
  const questions = type === 'phq9' ? phqQuestions : epdsQuestions;
  const [answers, setAnswers] = useState<Array<number | null>>(Array(questions.length).fill(null));
  const title = type === 'phq9' ? 'Cuestionario PHQ-9' : 'Cuestionario EPDS';
  const submit = async () => {
    if (answers.some((answer) => answer === null)) return Alert.alert('Faltan respuestas', 'Responde todas las preguntas antes de continuar.');
    const score = answers.reduce<number>((total, answer) => total + (answer ?? 0), 0);
    const key = type === 'phq9' ? storageKeys.phq9 : storageKeys.epds;
    await writeJson(key, { score, date: new Date().toISOString() });
    router.push({ pathname: type === 'phq9' ? '/phq9-result' : '/epds-result', params: { score: String(score) } });
  };
  return <Screen><Header title={title} /><Card tone="beige"><Text style={{ color: colors.text, lineHeight: 21 }}>{type === 'phq9' ? 'Este cuestionario es una herramienta de detección. No es un diagnóstico médico.' : 'La EPDS es una herramienta de detección y no proporciona por sí sola un diagnóstico.'}</Text></Card>{questions.map((question, index) => <Card key={question}><Text style={{ color: colors.text, fontWeight: '700', lineHeight: 21 }}>{index + 1}. {question}</Text><View style={{ marginTop: 11 }}>{options.map((option, value) => <Pressable key={option} onPress={() => setAnswers((current) => current.map((answer, i) => i === index ? value : answer))} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }, pressed && styles.pressed]}><Ionicons name={answers[index] === value ? 'radio-button-on' : 'radio-button-off'} size={20} color={answers[index] === value ? colors.mintDark : colors.border} /><Text style={{ color: colors.text, marginLeft: 9 }}>{option} ({value})</Text></Pressable>)}</View></Card>)}<Button title="Ver resultado" onPress={submit} icon="arrow-forward" /></Screen>;
}

export function PHQ9View() { return <QuestionnaireView type="phq9" />; }
export function EPDSView() { return <QuestionnaireView type="epds" />; }

function ResultView({ type }: { type: 'phq9' | 'epds' }) {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams<{ score?: string }>();
  const score = Number(params.score ?? 0);
  return <Screen><Header title={type === 'phq9' ? 'Resultado PHQ-9' : 'Resultado EPDS'} /><View style={{ alignItems: 'center', marginTop: 18 }}><View style={{ width: 140, height: 140, borderRadius: 70, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center', borderWidth: 10, borderColor: colors.white }}><Text style={{ color: colors.text, fontSize: 40, fontWeight: '700' }}>{score}</Text><Text style={{ color: colors.mutedForeground, fontSize: 12 }}>puntaje</Text></View><Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 18 }}>Gracias por responder</Text><ScorePill score={score} type={type} /></View><Card tone="beige" style={{ marginTop: 24 }}><Text style={{ color: colors.text, lineHeight: 22 }}>{type === 'phq9' ? 'Este resultado es únicamente orientativo. Si tus síntomas te preocupan, considera hablar con un profesional de salud.' : 'La EPDS es una herramienta de detección y no proporciona por sí sola un diagnóstico. Si algo te preocupa, busca apoyo profesional.'}</Text></Card><Button title="Volver al inicio" onPress={() => router.replace('/(tabs)')} icon="home-outline" /></Screen>;
}

export function PHQ9ResultView() { return <ResultView type="phq9" />; }
export function EPDSResultView() { return <ResultView type="epds" />; }

export function WellbeingView() {
  const router = useRouter();
  const colors = useColors();
  const [phq, setPhq] = useState<ScoreRecord | null>(null);
  const [epds, setEpds] = useState<ScoreRecord | null>(null);
  useFocusEffect(React.useCallback(() => { Promise.all([readJson<ScoreRecord | null>(storageKeys.phq9, null), readJson<ScoreRecord | null>(storageKeys.epds, null)]).then(([a, b]) => { setPhq(a); setEpds(b); }); }, []));
  return <Screen><View style={{ marginBottom: 4 }}><Text style={[styles.headerTitle, { color: colors.text }]}>Mi bienestar</Text><Text style={[styles.body, { color: colors.mutedForeground, marginTop: 5 }]}>Conocerte también es una forma de cuidarte.</Text></View><SectionTitle title="Mis resultados" />{phq ? <Card><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><View><Text style={{ color: colors.text, fontWeight: '700', fontSize: 17 }}>PHQ-9</Text><Text style={{ color: colors.mutedForeground, marginTop: 4 }}>{formatDate(phq.date)}</Text></View><ScorePill score={phq.score} type="phq9" /></View></Card> : <Card tone="beige"><Text style={{ color: colors.text, fontWeight: '700' }}>Aún no has respondido el PHQ-9</Text><Button title="Comenzar cuestionario" variant="outline" onPress={() => router.push('/phq9')} /></Card>}{epds ? <Card><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><View><Text style={{ color: colors.text, fontWeight: '700', fontSize: 17 }}>EPDS</Text><Text style={{ color: colors.mutedForeground, marginTop: 4 }}>{formatDate(epds.date)}</Text></View><ScorePill score={epds.score} type="epds" /></View></Card> : <Card tone="beige"><Text style={{ color: colors.text, fontWeight: '700' }}>Aún no has respondido la EPDS</Text><Button title="Comenzar cuestionario" variant="outline" onPress={() => router.push('/epds')} /></Card>}<SectionTitle title="Volver a hacerlo" /><Button title="Nuevo PHQ-9" variant="secondary" onPress={() => router.push('/phq9')} icon="sparkles-outline" /><Button title="Nueva EPDS" variant="outline" onPress={() => router.push('/epds')} icon="heart-outline" /></Screen>;
}

export function SelfCareView() {
  const router = useRouter();
  const colors = useColors();
  const items = [
    ['Respiración', 'Calma tu mente en 3 minutos', 'cloud-outline', 3],
    ['Relajación', 'Libera tensión del cuerpo', 'body-outline', 5],
    ['Sueño', 'Consejos para dormir mejor', 'moon-outline', 3],
    ['Movimiento', 'Estiramientos suaves', 'walk-outline', 3],
  ] as const;
  return <Screen><Header title="Cuídate un poquito hoy" subtitle="Pequeñas pausas también cuentan" />{items.map(([title, description, icon, minutes]) => <Card key={title} onPress={() => router.push({ pathname: '/breathing', params: { minutes: String(minutes), title } })}><View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' }}><Ionicons name={icon} size={24} color={colors.mintDark} /></View><View style={{ flex: 1, marginLeft: 13 }}><Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{title}</Text><Text style={{ color: colors.mutedForeground, marginTop: 4 }}>{description}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} /></View></Card>)}</Screen>;
}

export function BreathingView() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams<{ minutes?: string; title?: string }>();
  const minutes = Number(params.minutes ?? 3);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [phase, setPhase] = useState<'Inhala' | 'Exhala'>('Inhala');
  const scale = useRef(new Animated.Value(0.72)).current;
  useEffect(() => {
    if (!running) return;
    const animation = Animated.loop(Animated.sequence([Animated.timing(scale, { toValue: 1, duration: 4000, useNativeDriver: true }), Animated.timing(scale, { toValue: 0.72, duration: 4000, useNativeDriver: true })]));
    animation.start();
    const phaseTimer = setInterval(() => setPhase((current) => current === 'Inhala' ? 'Exhala' : 'Inhala'), 4000);
    const endTimer = setTimeout(() => { animation.stop(); clearInterval(phaseTimer); setRunning(false); setFinished(true); }, minutes * 60 * 1000);
    return () => { animation.stop(); clearInterval(phaseTimer); clearTimeout(endTimer); };
  }, [running, minutes, scale]);
  return <Screen scroll={false}><Header title={params.title || 'Respiración'} subtitle={`${minutes} minutos para volver a ti`} /><View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>{finished ? <><Ionicons name="heart-circle" size={96} color={colors.mintDark} /><Text style={{ color: colors.text, fontSize: 24, fontWeight: '700', marginTop: 20 }}>Lo hiciste muy bien</Text><Text style={{ color: colors.mutedForeground, marginTop: 7 }}>Tu cuerpo agradece esta pausa.</Text></> : <><Animated.View style={{ width: 205, height: 205, borderRadius: 103, backgroundColor: colors.lilac, alignItems: 'center', justifyContent: 'center', transform: [{ scale }] }}><View style={{ width: 155, height: 155, borderRadius: 78, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.text, fontWeight: '700', fontSize: 23 }}>{running ? phase : 'Lista'}</Text><Text style={{ color: colors.mutedForeground, marginTop: 4 }}>{running ? 'Sigue el ritmo' : 'Respira contigo'}</Text></View></Animated.View></>}</View><Button title={finished ? 'Volver' : running ? 'Pausar' : 'Comenzar'} onPress={() => finished ? router.back() : setRunning((value) => !value)} icon={finished ? 'arrow-back' : running ? 'pause' : 'play'} /></Screen>;
}

export function ResourcesView() {
  const colors = useColors();
  const resources = [
    ['Psicólogos', 'Encuentra apoyo emocional especializado', 'people-outline'],
    ['Podcasts', 'Conversaciones para acompañarte', 'mic-outline'],
    ['Videos', 'Prácticas guiadas para tu bienestar', 'play-circle-outline'],
    ['Artículos', 'Información clara para cada etapa', 'document-text-outline'],
    ['Líneas de ayuda', 'Apoyo disponible cuando lo necesites', 'call-outline'],
  ] as const;
  return <Screen><Header title="Recursos para ti" />{resources.map(([title, description, icon]) => <Card key={title} onPress={() => Alert.alert(title, 'Este recurso estará disponible próximamente.')}><View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name={icon} size={26} color={colors.lilacDark} /><View style={{ flex: 1, marginLeft: 13 }}><Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{title}</Text><Text style={{ color: colors.mutedForeground, marginTop: 4 }}>{description}</Text></View><Text style={{ color: colors.mintDark, fontWeight: '700' }}>Abrir</Text></View></Card>)}</Screen>;
}

const specialists = [
  { name: 'Dra. María López', specialty: 'Psicóloga', modality: 'Consulta en línea', location: 'Av. Reforma 123', phone: '555-123-4567' },
  { name: 'Dr. Juan Pérez', specialty: 'Ginecólogo', modality: 'Consulta presencial', location: 'Calle 5 #45', phone: '555-987-6543' },
  { name: 'Lic. Ana Ruiz', specialty: 'Salud mental', modality: 'Consulta en línea', location: 'Blvd. Central 200', phone: '555-456-7890' },
  { name: 'Dra. Carla Méndez', specialty: 'Psicóloga', modality: 'Consulta presencial', location: 'Av. Juárez 88', phone: '555-321-0987' },
];

export function SpecialistsView() {
  const colors = useColors();
  return <Screen><Header title="Apoyo profesional" /><Card tone="beige"><Text style={{ color: colors.text, fontWeight: '700' }}>Especialistas de demostración</Text><Text style={{ color: colors.mutedForeground, lineHeight: 20, marginTop: 4 }}>Los perfiles de esta pantalla son ficticios y sirven para mostrar cómo funcionará la experiencia.</Text></Card>{specialists.slice(0, 3).map((person) => <Card key={person.name}><Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{person.name}</Text><Text style={{ color: colors.lilacDark, fontWeight: '600', marginTop: 4 }}>{person.specialty}</Text><Text style={{ color: colors.mutedForeground, marginTop: 5 }}>{person.modality} · {person.location}</Text><View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}><Button title="Ver perfil" variant="outline" onPress={() => Alert.alert(person.name, 'Perfil de demostración de MaternIA.')} /><Button title="Agendar" variant="secondary" onPress={() => Alert.alert('Agendar', 'Esta opción abrirá el flujo de citas próximamente.')} /></View></Card>)}</Screen>;
}

export function MapViewScreen() {
  const colors = useColors();
  const [filter, setFilter] = useState('Todos');
  const filters = ['Todos', 'Psicólogos', 'Ginecólogos', 'Salud mental'];
  const shown = filter === 'Todos' ? specialists : specialists.filter((person) => person.specialty === filter || (filter === 'Salud mental' && person.specialty === 'Salud mental'));
  return <Screen><Header title="Especialistas cerca de ti" subtitle="Encuentra apoyo cuando lo necesites" /><Card tone="beige"><Text style={{ color: colors.text, fontWeight: '700' }}>Información de demostración</Text><Text style={{ color: colors.mutedForeground, marginTop: 4, lineHeight: 20 }}>Estos datos son ficticios. El mapa real estará disponible en una versión futura.</Text></Card><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 }}>{filters.map((item) => <Pressable key={item} onPress={() => setFilter(item)} style={{ paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, backgroundColor: filter === item ? colors.mintDark : colors.card }}><Text style={{ color: filter === item ? colors.white : colors.mutedForeground, fontSize: 12, fontWeight: '700' }}>{item}</Text></Pressable>)}</View>{shown.map((person) => <Card key={person.name}><Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{person.name}</Text><Text style={{ color: colors.lilacDark, marginTop: 4 }}>{person.specialty}</Text><Text style={{ color: colors.mutedForeground, marginTop: 4 }}>{person.location}</Text><View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}><Button title="Llamar" variant="outline" onPress={() => Linking.openURL(`tel:${person.phone}`)} icon="call-outline" /><Button title="Ver en mapas" variant="secondary" onPress={() => Linking.openURL(`geo:0,0?q=${encodeURIComponent(person.location)}`)} icon="navigate-outline" /></View></Card>)}</Screen>;
}

export function AppointmentsView() {
  const colors = useColors();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState({ date: '', time: '', pro: '', type: '', notes: '' });
  useFocusEffect(React.useCallback(() => { readJson<Appointment[]>(storageKeys.appointments, []).then(setAppointments); }, []));
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const save = async () => {
    if (!form.date.trim() || !form.time.trim() || !form.pro.trim() || !form.type.trim()) return Alert.alert('Completa la cita', 'Fecha, hora, profesional y tipo son obligatorios.');
    const next = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ...form };
    const all = [next, ...appointments];
    await writeJson(storageKeys.appointments, all);
    setAppointments(all);
    setForm({ date: '', time: '', pro: '', type: '', notes: '' });
    Alert.alert('Cita guardada', 'La cita quedó registrada en tu agenda.');
  };
  return <Screen><Header title="Mis citas" subtitle="Organiza tus próximas visitas" /><Card tone="beige"><Input label="Fecha (DD/MM/AAAA)" value={form.date} onChangeText={(value) => update('date', value)} placeholder="30/09/2026" /><Input label="Hora" value={form.time} onChangeText={(value) => update('time', value)} placeholder="10:00" /><Input label="Profesional" value={form.pro} onChangeText={(value) => update('pro', value)} placeholder="Nombre de tu profesional" /><Input label="Tipo" value={form.type} onChangeText={(value) => update('type', value)} placeholder="Consulta, terapia..." /><Input label="Notas" value={form.notes} onChangeText={(value) => update('notes', value)} placeholder="Algo que quieras recordar" /><Button title="Guardar cita" onPress={save} icon="calendar-outline" /></Card><SectionTitle title="Próximas citas" />{appointments.length === 0 ? <EmptyState icon="calendar-outline" title="No tienes citas guardadas" text="Añade una para verla aquí." /> : appointments.map((appointment) => <Card key={appointment.id}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><View><Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{appointment.pro}</Text><Text style={{ color: colors.lilacDark, marginTop: 4 }}>{appointment.type}</Text></View><Text style={{ color: colors.mintDark, fontWeight: '700' }}>{appointment.date}</Text></View><Text style={{ color: colors.mutedForeground, marginTop: 8 }}>{appointment.time}{appointment.notes ? ` · ${appointment.notes}` : ''}</Text></Card>)}</Screen>;
}

export function CommunityView() {
  const colors = useColors();
  const { user } = useApp();
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  useFocusEffect(React.useCallback(() => { readJson<Post[]>(storageKeys.posts, []).then(setPosts); }, []));
  const publish = async () => {
    if (!text.trim()) return Alert.alert('Escribe algo', 'Comparte una idea, una pregunta o cómo te sientes.');
    const post = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, author: anonymous ? 'Anónima' : user?.name || 'Mamá MaternIA', text: text.trim(), date: new Date().toISOString(), likes: 0 };
    const all = [post, ...posts];
    await writeJson(storageKeys.posts, all);
    setPosts(all);
    setText('');
  };
  return <Screen><Header title="Comunidad MaternIA" subtitle="Un espacio para acompañarnos" /><Card tone="lilac"><Input label="¿Qué quieres compartir?" value={text} onChangeText={setText} placeholder="Escribe aquí..." multiline numberOfLines={4} textAlignVertical="top" /><View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text style={{ color: colors.text }}>Publicar anónimamente</Text><Switch value={anonymous} onValueChange={setAnonymous} trackColor={{ false: colors.border, true: colors.mintDark }} thumbColor={colors.white} /></View><Button title="Publicar" onPress={publish} icon="paper-plane-outline" /></Card>{posts.length === 0 ? <EmptyState icon="people-outline" title="Sé la primera en compartir" text="Tu comunidad está aquí para escucharte." /> : posts.map((post) => <Card key={post.id}><View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="person" size={17} color={colors.mintDark} /></View><View style={{ marginLeft: 9 }}><Text style={{ color: colors.text, fontWeight: '700' }}>{post.author}</Text><Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{formatDate(post.date)}</Text></View></View><Text style={{ color: colors.text, lineHeight: 21, marginTop: 13 }}>{post.text}</Text><View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 13 }}><Ionicons name="heart-outline" size={18} color={colors.lilacDark} /><Text style={{ color: colors.mutedForeground, marginLeft: 5 }}>{post.likes}</Text></View></Card>)}</Screen>;
}

export function HealthView() {
  const colors = useColors();
  const [connected, setConnected] = useState(false);
  const [demo, setDemo] = useState(false);
  const connect = async () => {
    const authorized = await healthKitService.requestAuthorization();
    if (!authorized) Alert.alert('Apple Salud', 'Apple Salud estará disponible cuando instales la app como Development Build en tu iPhone.', [{ text: 'Entendido' }, { text: 'Simular conexión (demo)', onPress: () => { setConnected(true); setDemo(true); } }]);
  };
  return <Screen><Header title="Salud y dispositivos" subtitle="Apple Watch · Apple Salud · MaternIA" />{connected && demo ? <><Card tone="mint"><View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="checkmark-circle" size={25} color={colors.mintDark} /><Text style={{ color: colors.text, fontWeight: '700', fontSize: 16, marginLeft: 9 }}>Apple Salud conectado</Text></View><Text style={{ color: colors.text, marginTop: 18 }}>Frecuencia cardíaca</Text><Text style={{ color: colors.text, fontSize: 36, fontWeight: '700', marginTop: 2 }}>78 <Text style={{ fontSize: 15, fontWeight: '500' }}>lpm</Text></Text><Text style={{ color: colors.mutedForeground, marginTop: 4 }}>Última medición: hace 1 hora</Text><Text style={{ color: colors.mutedForeground, marginTop: 3 }}>Promedio: 76 lpm</Text></Card><Button title="Sincronizar de nuevo" variant="outline" onPress={() => Alert.alert('Sincronización', 'No hay nuevas mediciones en esta demo.')} icon="sync-outline" /></> : <Card tone="beige"><Ionicons name="watch-outline" size={42} color={colors.lilacDark} /><Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginTop: 12 }}>Conecta tus dispositivos</Text><Text style={{ color: colors.mutedForeground, lineHeight: 21, marginTop: 6 }}>MaternIA leerá únicamente la información que autorices en Apple Salud. No conectamos directamente con tu Apple Watch.</Text><Button title="Conectar con Apple Salud" onPress={connect} icon="heart-outline" /></Card>}<Card style={{ marginTop: 5 }}><Text style={{ color: colors.text, fontWeight: '700' }}>Tu privacidad primero</Text><Text style={{ color: colors.mutedForeground, lineHeight: 20, marginTop: 5 }}>Los datos biométricos complementan tus cuestionarios, no diagnostican depresión ni ansiedad y nunca se tratan como cero cuando no existen.</Text></Card></Screen>;
}

export function ProfileView() {
  const router = useRouter();
  const { user, stage, logout } = useApp();
  const colors = useColors();
  const signOut = async () => { await logout(); router.replace('/login'); };
  return <Screen><View style={{ alignItems: 'center', marginBottom: 20 }}><BrandMark size={92} /><Text style={[styles.headerTitle, { color: colors.text, marginTop: 10 }]}>{user?.name || 'Tu perfil'}</Text><Text style={{ color: colors.mutedForeground, marginTop: 4 }}>{user?.email}</Text></View><Card><View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}><Text style={{ color: colors.mutedForeground }}>Etapa</Text><Text style={{ color: colors.text, fontWeight: '700' }}>{stage === 'embarazo' ? 'Embarazo' : 'Posparto'}</Text></View><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: colors.mutedForeground }}>Fecha de registro</Text><Text style={{ color: colors.text, fontWeight: '700' }}>Hoy</Text></View></Card><Button title="Editar perfil" variant="outline" onPress={() => Alert.alert('Editar perfil', 'Puedes actualizar tus datos en una próxima versión.')} icon="create-outline" /><Button title="Configuración" variant="secondary" onPress={() => router.push('/settings')} icon="settings-outline" /><Button title="Cerrar sesión" variant="ghost" onPress={signOut} icon="log-out-outline" /></Screen>;
}

export function SettingsView() {
  const router = useRouter();
  const colors = useColors();
  const { logout } = useApp();
  const [notifications, setNotifications] = useState(true);
  const signOut = async () => { await logout(); router.replace('/login'); };
  return <Screen><Header title="Configuración" /><Card><View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><View><Text style={{ color: colors.text, fontWeight: '700' }}>Notificaciones</Text><Text style={{ color: colors.mutedForeground, marginTop: 4 }}>Recordatorios amables para cuidarte</Text></View><Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: colors.border, true: colors.mintDark }} thumbColor={colors.white} /></View></Card><Card onPress={() => Alert.alert('Idioma', 'MaternIA está disponible en español.')}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: colors.text, fontWeight: '700' }}>Idioma</Text><Text style={{ color: colors.mutedForeground }}>Español</Text></View></Card><Card onPress={() => Alert.alert('Privacidad', 'Solo guardamos información local en tu dispositivo en esta versión.')}><Text style={{ color: colors.text, fontWeight: '700' }}>Privacidad</Text><Text style={{ color: colors.mutedForeground, marginTop: 4 }}>Cómo cuidamos tus datos</Text></Card><Card onPress={() => Alert.alert('Ayuda', 'Si necesitas apoyo inmediato, contacta a los servicios de emergencia de tu localidad.')}><Text style={{ color: colors.text, fontWeight: '700' }}>Ayuda</Text><Text style={{ color: colors.mutedForeground, marginTop: 4 }}>Preguntas frecuentes y apoyo</Text></Card><Button title="Volver al perfil" variant="outline" onPress={() => router.back()} /><Button title="Cerrar sesión" variant="ghost" onPress={signOut} icon="log-out-outline" /></Screen>;
}

export function NotificationsView() {
  const colors = useColors();
  return <Screen><Header title="Notificaciones" /><EmptyState icon="notifications-outline" title="Todo al día" text="Aquí aparecerán tus recordatorios y novedades." /><Card tone="beige"><Text style={{ color: colors.text, fontWeight: '700' }}>Un recordatorio para ti</Text><Text style={{ color: colors.mutedForeground, marginTop: 5, lineHeight: 20 }}>No tienes que hacerlo todo hoy. Elige una cosa pequeña que te haga bien.</Text></Card></Screen>;
}
