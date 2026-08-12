import { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AIOrb } from '@/components/brand/PerformaLogo';
import { AppText, Input, ScreenHeader } from '@/components/ui';
import { useAIStore } from '@/stores/ai-store';
import { colors, radius, spacing } from '@/theme';

const SUGGESTIONS = [
  'Estou consumindo proteína suficiente?',
  'Qual foi minha evolução no supino?',
  'Posso trocar arroz por batata?',
  'Como está meu volume semanal?',
];

export default function AIChatScreen() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [draft, setDraft] = useState('');
  const messages = useAIStore((s) => s.messages);
  const isTyping = useAIStore((s) => s.isTyping);
  const send = useAIStore((s) => s.send);

  const handleSend = async (text?: string) => {
    const value = (text ?? draft).trim();
    if (!value) return;
    setDraft('');
    await send(value);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={8}
    >
      <View style={[styles.flex, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
        <ScreenHeader title="PERFORMA AI" showBack />

        <View style={styles.hero}>
          <AIOrb size={72} />
          <AppText variant="caption" muted center>
            Sugestões com base nos seus dados. Não substitui profissional de saúde.
          </AppText>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          ListHeaderComponent={
            <View style={styles.suggestions}>
              {SUGGESTIONS.map((item) => (
                <Pressable
                  key={item}
                  style={styles.suggestion}
                  onPress={() => handleSend(item)}
                >
                  <AppText variant="caption">{item}</AppText>
                </Pressable>
              ))}
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <AppText
                variant="body"
                color={item.role === 'user' ? colors.onPrimary : colors.white}
              >
                {item.content}
              </AppText>
            </View>
          )}
          ListFooterComponent={
            isTyping ? (
              <AppText variant="caption" muted style={{ marginTop: spacing.sm }}>
                PERFORMA AI está pensando…
              </AppText>
            ) : null
          }
        />

        <View style={styles.composer}>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="Pergunte sobre treino, dieta ou progresso"
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
            />
          </View>
          <Pressable
            style={[styles.send, (!draft.trim() || isTyping) && styles.sendDisabled]}
            disabled={!draft.trim() || isTyping}
            onPress={() => handleSend()}
            accessibilityRole="button"
            accessibilityLabel="Enviar"
          >
            <AppText variant="label" color={colors.onPrimary}>
              Enviar
            </AppText>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  suggestion: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.secondaryMuted,
    borderWidth: 1,
    borderColor: 'rgba(123,92,255,0.35)',
  },
  bubble: {
    maxWidth: '88%',
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderSubtle,
  },
  send: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.45 },
});
