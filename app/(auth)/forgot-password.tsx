import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppButton, AppText, Input, Screen } from '@/components/ui';
import { colors, spacing } from '@/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email.includes('@')) {
      Alert.alert('E-mail inválido', 'Informe um e-mail válido.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    Alert.alert(
      'E-mail enviado',
      'Se existir uma conta com este e-mail, você receberá um link para redefinir a senha.',
      [{ text: 'OK', onPress: () => router.back() }],
    );
  };

  return (
    <Screen>
      <View style={styles.body}>
        <AppText variant="h1">Recuperar senha</AppText>
        <AppText variant="body" muted style={{ marginTop: spacing.sm }}>
          Informe seu e-mail para receber o link de redefinição.
        </AppText>

        <Input
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="seu@email.com"
          style={{ marginTop: spacing['2xl'] }}
        />

        <AppButton
          label="Enviar link"
          loading={loading}
          onPress={onSubmit}
          style={{ marginTop: spacing.xl }}
        />
        <AppButton
          label="Voltar"
          variant="ghost"
          onPress={() => router.back()}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing['4xl'],
  },
});
