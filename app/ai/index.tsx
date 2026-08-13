import { BookOpen, Send, Sparkles } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { AppText, ScreenHeader } from '@/components/ui';
import { useAIStore } from '@/stores/ai-store';
import { colors, radius, spacing } from '@/theme';

export default function AIScreen() {
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const messages = useAIStore((s) => s.messages);
  const isTyping = useAIStore((s) => s.isTyping);
  const send = useAIStore((s) => s.send);
  const suggestions = useAIStore((s) => s.suggestions());

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isTyping) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput('');
    void send(msg);
  };

  const showEmptyHints = messages.length <= 1;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScreenHeader title="Coach Especialista" showBack />
      <AppText variant="caption" muted style={styles.subtitle}>
        EF · Fisioterapia · Musculação · Periodização
      </AppText>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.chat}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {showEmptyHints ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <BookOpen size={28} color={colors.primary} />
              </View>
              <AppText variant="h3">Base científica ativa</AppText>
              <AppText variant="caption" muted style={styles.emptyText}>
                Literatura de educação física, fisioterapia e musculação + estudos InVictus/V Athlete
                e treino em casa (Dhoze). Peça periodização, técnica ou suporte.
              </AppText>
              <View style={styles.suggestions}>
                {suggestions.map((s) => (
                  <Pressable
                    key={s}
                    style={({ pressed }) => [styles.suggestionChip, pressed && { opacity: 0.7 }]}
                    onPress={() => handleSend(s)}
                  >
                    <AppText variant="bodyMedium">{s}</AppText>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}
            >
              {msg.role === 'assistant' ? (
                <View style={styles.aiLabel}>
                  <Sparkles size={12} color={colors.primary} />
                  <AppText variant="caption" color={colors.primary}>
                    Coach
                  </AppText>
                </View>
              ) : null}
              <AppText
                variant="body"
                color={msg.role === 'user' ? '#fff' : colors.text}
                style={styles.bubbleText}
              >
                {msg.content}
              </AppText>
              {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 ? (
                <View style={styles.sourcesBox}>
                  <AppText variant="caption" muted style={styles.sourcesTitle}>
                    Fontes consultadas
                  </AppText>
                  {msg.sources.slice(0, 4).map((src) => (
                    <AppText key={src} variant="caption" muted>
                      · {src}
                    </AppText>
                  ))}
                </View>
              ) : null}
              <AppText
                variant="caption"
                color={msg.role === 'user' ? 'rgba(255,255,255,0.65)' : colors.textMuted}
                style={styles.bubbleTime}
              >
                {new Date(msg.createdAt).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </AppText>
            </View>
          ))}

          {isTyping ? (
            <View style={[styles.bubble, styles.aiBubble, styles.typingBubble]}>
              <ActivityIndicator size="small" color={colors.primary} />
              <AppText variant="caption" muted>
                Consultando a base científica...
              </AppText>
            </View>
          ) : null}
        </ScrollView>

        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Pergunte sobre treino, técnica ou periodização..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={500}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <Pressable
            style={[styles.sendBtn, (!input.trim() || isTyping) && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!input.trim() || isTyping}
          >
            <Send size={18} color={input.trim() && !isTyping ? '#fff' : colors.textMuted} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  subtitle: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  chat: { flex: 1 },
  chatContent: { padding: spacing.lg, paddingBottom: spacing.sm, gap: spacing.sm },
  emptyState: { alignItems: 'center', paddingTop: spacing.lg, paddingHorizontal: spacing.sm, gap: spacing.sm },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyText: { textAlign: 'center', marginBottom: spacing.md },
  suggestions: { width: '100%', gap: spacing.sm },
  suggestionChip: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubble: {
    maxWidth: '90%',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiLabel: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  bubbleText: { lineHeight: 21 },
  sourcesBox: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 2,
  },
  sourcesTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  bubbleTime: { marginTop: 6, alignSelf: 'flex-end' },
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: colors.surface },
});
