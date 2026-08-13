import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { PerformaLogo } from '@/components/brand/PerformaLogo';
import { AppButton, AppText, Input, Screen } from '@/components/ui';
import { registerSchema, type RegisterInput } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth-store';
import { colors, spacing } from '@/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      await register(data.name, data.email, data.password);
      router.replace('/(evaluation)');
    } finally {
      setLoading(false);
    }
  });

  return (
    <Screen scroll>
      <View style={styles.top}>
        <PerformaLogo size={56} showWordmark={false} />
        <AppText variant="h1" style={{ marginTop: spacing.xl }}>
          Crie sua conta
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
          Comece sua jornada no PERFORMA.
        </AppText>
      </View>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nome completo"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={formState.errors.name?.message}
            placeholder="Amanda Silva"
            autoCapitalize="words"
          />
        )}
      />
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
            placeholder="Mínimo 6 caracteres"
          />
        )}
      />

      <AppButton
        label="Criar conta"
        loading={loading}
        onPress={onSubmit}
        style={{ marginTop: spacing.xl }}
      />

      <Pressable onPress={() => router.back()} style={styles.back}>
        <AppText variant="body" muted center>
          Já tem conta?{' '}
          <AppText variant="bodyMedium" color={colors.primary}>
            Entrar
          </AppText>
        </AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { marginTop: spacing.xl, marginBottom: spacing['2xl'] },
  back: { marginTop: spacing['2xl'], minHeight: 44, justifyContent: 'center' },
});
