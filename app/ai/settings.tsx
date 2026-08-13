import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Card,
  Input,
  Screen,
  ScreenHeader,
} from '@/components/ui';
import { OPENROUTER_MODEL_OPTIONS } from '@/services/openrouter';
import { useSettingsStore } from '@/stores/settings-store';
import { colors, radius, spacing } from '@/theme';

export default function AISettingsScreen() {
  const storedKey = useSettingsStore((s) => s.openRouterApiKey);
  const model = useSettingsStore((s) => s.openRouterModel);
  const preferCloud = useSettingsStore((s) => s.preferCloudCoach);
  const setKey = useSettingsStore((s) => s.setOpenRouterApiKey);
  const setModel = useSettingsStore((s) => s.setOpenRouterModel);
  const setPreferCloud = useSettingsStore((s) => s.setPreferCloudCoach);
  const clearKey = useSettingsStore((s) => s.clearOpenRouterApiKey);
  const hasKey = useSettingsStore((s) => s.hasOpenRouterKey());

  const [draftKey, setDraftKey] = useState(storedKey);
  const [saved, setSaved] = useState(false);

  return (
    <Screen scroll>
      <ScreenHeader title="OpenRouter" showBack />
      <AppText variant="body" muted style={{ marginBottom: spacing.lg }}>
        Cole sua API key do OpenRouter. O Coach usa o modelo escolhido + a base científica local
        (ACSM, NSCA, Schoenfeld, IOC e estudos carregados). Sem key, o modo local continua ativo.
      </AppText>

      <Card style={styles.card}>
        <AppText variant="h3">API Key</AppText>
        <AppText variant="caption" muted>
          Crie em openrouter.ai/keys · fica só neste dispositivo (AsyncStorage). Em produção
          avançada, prefira proxy no backend.
        </AppText>
        <Input
          label="API Key OpenRouter"
          placeholder="sk-or-v1-..."
          value={draftKey}
          onChangeText={(v) => {
            setDraftKey(v);
            setSaved(false);
          }}
          autoCapitalize="none"
          autoCorrect={false}
          isPassword
        />
        <AppButton
          label={saved ? 'Salva ✓' : 'Salvar chave'}
          onPress={() => {
            setKey(draftKey);
            setSaved(true);
          }}
        />
        {hasKey ? (
          <AppButton
            label="Remover chave"
            variant="ghost"
            onPress={() => {
              clearKey();
              setDraftKey('');
              setSaved(false);
            }}
          />
        ) : null}
        <AppText variant="caption" color={hasKey ? colors.primary : colors.warning}>
          Status: {hasKey ? 'chave disponível' : 'sem chave — modo local'}
        </AppText>
      </Card>

      <Card style={styles.card}>
        <AppText variant="h3">Modelo</AppText>
        <View style={styles.models}>
          {OPENROUTER_MODEL_OPTIONS.map((opt) => {
            const selected = model === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setModel(opt.id)}
                style={[styles.modelChip, selected && styles.modelChipSelected]}
              >
                <AppText variant="bodyMedium" color={selected ? colors.onPrimary : colors.text}>
                  {opt.label}
                </AppText>
                <AppText
                  variant="caption"
                  color={selected ? colors.onPrimary : colors.textMuted}
                >
                  {opt.id}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card style={styles.card}>
        <AppText variant="h3">Modo</AppText>
        <AppButton
          label={preferCloud ? 'Usar OpenRouter quando houver key' : 'Forçar só modo local'}
          variant={preferCloud ? 'secondary' : 'ghost'}
          onPress={() => setPreferCloud(!preferCloud)}
        />
        <AppText variant="caption" muted>
          Com OpenRouter ligado, cada pergunta envia trechos relevantes da base (RAG) como
          contexto ao modelo.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, marginBottom: spacing.lg },
  models: { gap: spacing.sm },
  modelChip: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    gap: 4,
  },
  modelChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
