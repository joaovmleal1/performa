import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { Apple } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { PerformaLogo } from '@/components/brand/PerformaLogo';
import { AppButton, AppText, Input, Screen } from '@/components/ui';
import { loginSchema, type LoginInput } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth-store';
import { colors, radius, spacing } from '@/theme';

/** Tela 05 — Login (spec pixel-perfect) */
export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const skipToApp = useAuthStore((s) => s.skipToApp);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      const hasCompletedEvaluation = useAuthStore.getState().hasCompletedEvaluation;
      router.replace(hasCompletedEvaluation ? '/(tabs)' : '/(evaluation)');
    } finally {
      setLoading(false);
    }
  });

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.top}>
        <PerformaLogo size={64} />
        <AppText variant="h1" style={styles.headline}>
          Bem-vindo de volta!
        </AppText>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="E-mail"
              autoCapitalize="none"
              keyboardType="email-address"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={formState.errors.email?.message}
              placeholder="seu@email.com"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Senha"
              isPassword
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={formState.errors.password?.message}
              placeholder="••••••••"
            />
          )}
        />

        <Link href="/(auth)/forgot-password" asChild>
          <Pressable style={styles.forgot}>
            <AppText variant="label" color={colors.primary}>
              Esqueci minha senha
            </AppText>
          </Pressable>
        </Link>

        <AppButton label="Entrar" loading={loading} onPress={onSubmit} />
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <AppText variant="caption" color={colors.textMuted}>
          ou continue com
        </AppText>
        <View style={styles.line} />
      </View>

      <View style={styles.socialRow}>
        <Pressable style={styles.socialBtn} accessibilityLabel="Continuar com Apple">
          <Apple size={22} color={colors.white} strokeWidth={1.85} />
        </Pressable>
        <Pressable style={styles.socialBtn} accessibilityLabel="Continuar com Google">
          <AppText variant="h3" color={colors.white}>
            G
          </AppText>
        </Pressable>
      </View>

      <AppButton
        label="Continuar como demo"
        variant="ghost"
        onPress={() => {
          skipToApp();
          router.replace('/(tabs)');
        }}
        style={{ marginTop: spacing.lg }}
      />

      <Pressable
        onPress={() => router.push('/(auth)/register')}
        style={styles.register}
      >
        <AppText variant="body" color={colors.textSecondary} center>
          Ainda não tem conta?{' '}
          <AppText variant="bodyMedium" color={colors.primary}>
            Criar conta
          </AppText>
        </AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing['5xl'] },
  top: {
    marginTop: spacing['3xl'],
    marginBottom: spacing['3xl'],
    alignItems: 'center',
    gap: spacing['2xl'],
  },
  headline: { textAlign: 'center' },
  form: { gap: spacing.md },
  forgot: {
    alignSelf: 'flex-end',
    minHeight: 40,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing['2xl'],
    marginBottom: spacing.xl,
  },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.borderStrong },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  register: {
    marginTop: spacing['2xl'],
    minHeight: 44,
    justifyContent: 'center',
  },
});
