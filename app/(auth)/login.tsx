import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { PerformaLogo } from '@/components/brand/PerformaLogo';
import { AppButton, AppText, Input, Screen } from '@/components/ui';
import { loginSchema, type LoginInput } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth-store';
import { colors, spacing } from '@/theme';

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
    <Screen scroll>
      <View style={styles.top}>
        <PerformaLogo size={64} />
        <AppText variant="h1" style={{ marginTop: spacing['2xl'] }}>
          Bem-vindo de volta!
        </AppText>
        <AppText variant="body" muted style={{ marginTop: spacing.sm }}>
          Entre para continuar sua evolução.
        </AppText>
      </View>

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

      <AppButton
        label="Continuar como demo"
        variant="ghost"
        onPress={() => {
          skipToApp();
          router.replace('/(tabs)');
        }}
        style={{ marginTop: spacing.md }}
      />

      <Pressable
        onPress={() => router.push('/(auth)/register')}
        style={styles.register}
      >
        <AppText variant="body" muted center>
          Não tem conta?{' '}
          <AppText variant="bodyMedium" color={colors.primary}>
            Criar conta
          </AppText>
        </AppText>
      </Pressable>

      <AppText variant="caption" muted center style={styles.legal}>
        Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { marginTop: spacing['2xl'], marginBottom: spacing['3xl'], alignItems: 'center' },
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
    minHeight: 44,
    justifyContent: 'center',
  },
  register: { marginTop: spacing['2xl'], minHeight: 44, justifyContent: 'center' },
  legal: { marginTop: spacing.xl, paddingHorizontal: spacing.lg },
});
