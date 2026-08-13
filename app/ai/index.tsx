import { LinearGradient } from 'expo-linear-gradient';
import { Send } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
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

import { AIOrb } from '@/components/brand/PerformaLogo';
import { AppText, ScreenHeader } from '@/components/ui';
import { coachSuggestedPrompts } from '@/services/coach-agent';
import { useAIStore } from '@/stores/ai-store';
import { useAuthStore } from '@/stores/auth-store';
import { colors, gradients, radius, spacing } from '@/theme';

export default function AIScreen() {
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const messages = useAIStore((s) => s.messages);
  const isTyping = useAIStore((s) => s.isTyping);
  const send = useAIStore((s) => s.send);
  const user = useAuthStore((s) => s.user);
  // Não chamar factory no selector do Zustand (array novo a cada render → React #185)
  const suggestions = useMemo(() => coachSuggestedPrompts(user), [user]);

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
      <ScreenHeader title="Ajuda PERFORMA" showBack />
      <AppText variant="caption" muted style={styles.subtitle}>
        Tire dúvidas sobre seus treinos e exercícios
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
              <AIOrb size={96} />
              <AppText variant="h3">Como posso ajudar?</AppText>
              <AppText variant="caption" color={colors.textSecondary} style={styles.emptyText}>
                Pergunte sobre execução, organização do treino, recuperação ou seu planejamento.
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
                  <AIOrb size={22} />
                  <AppText variant="caption" color={colors.secondary}>
                    PERFORMA
                  </AppText>
                </View>
              ) : null}
              <AppText
                variant="body"
                color={msg.role === 'user' ? colors.onPrimary : colors.text}
                style={styles.bubbleText}
              >
                {msg.content}
              </AppText>
              <AppText
                variant="caption"
                color={msg.role === 'user' ? 'rgba(10,10,13,0.55)' : colors.textMuted}
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
                Preparando uma resposta...
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
            onPress={() => handleSend()}
            disabled={!input.trim() || isTyping}
            style={[styles.sendBtnShell, (!input.trim() || isTyping) && styles.sendBtnDisabled]}
          >
            {input.trim() && !isTyping ? (
              <LinearGradient
                colors={[...gradients.ai]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendBtn}
              >
                <Send size={18} color={colors.white} strokeWidth={1.85} />
              </LinearGradient>
            ) : (
              <View style={[styles.sendBtn, { backgroundColor: colors.surfaceMedium }]}>
                <Send size={18} color={colors.textMuted} strokeWidth={1.85} />
              </View>
            )}
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
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  emptyText: { textAlign: 'center', marginBottom: spacing.md },
  suggestions: { width: '100%', gap: spacing.sm },
  suggestionChip: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
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
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  bubbleText: { lineHeight: 21 },
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
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Sora_400Regular',
    color: colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtnShell: { borderRadius: radius.lg, overflow: 'hidden' },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.7 },
});
