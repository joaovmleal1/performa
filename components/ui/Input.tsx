import { colors, radius, spacing } from '@/theme';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { AppText } from './AppText';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
};

export function Input({
  label,
  error,
  hint,
  leftIcon,
  isPassword,
  style,
  ...rest
}: Props) {
  const [secure, setSecure] = useState(!!isPassword);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label ? <AppText variant="label" style={styles.label}>{label}</AppText> : null}
      <View
        style={[
          styles.field,
          focused && styles.focused,
          !!error && styles.errorBorder,
        ]}
      >
        {leftIcon ? <View style={styles.left}>{leftIcon}</View> : null}
        <TextInput
          {...rest}
          secureTextEntry={secure}
          placeholderTextColor={colors.textMuted}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[styles.input, style]}
          accessibilityLabel={label ?? rest.placeholder}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setSecure((v) => !v)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={secure ? 'Mostrar senha' : 'Ocultar senha'}
          >
            {secure ? (
              <Eye size={20} color={colors.textMuted} />
            ) : (
              <EyeOff size={20} color={colors.textMuted} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && hint ? <AppText variant="caption" muted>{hint}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs, width: '100%' },
  label: { color: colors.textSecondary, marginBottom: 2 },
  field: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  focused: {
    borderColor: colors.primary,
  },
  errorBorder: {
    borderColor: colors.error,
  },
  left: { marginRight: 2 },
  input: {
    flex: 1,
    color: colors.white,
    fontFamily: 'Sora_400Regular',
    fontSize: 16,
    paddingVertical: 12,
  },
  error: {
    color: colors.error,
    fontFamily: 'Sora_400Regular',
    fontSize: 13,
  },
});

export function PasswordInput(props: Omit<Props, 'isPassword'>) {
  return <Input {...props} isPassword />;
}

export function SearchInput(props: Props) {
  return <Input {...props} placeholder={props.placeholder ?? 'Buscar'} />;
}
