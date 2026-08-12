import { colors, typography } from '@/theme';
import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

type Variant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyMedium'
  | 'label'
  | 'caption'
  | 'metric'
  | 'metricLg'
  | 'button';

type Tone =
  | 'text'
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'purple'
  | 'danger'
  | 'error'
  | 'warning'
  | 'white'
  | 'onPrimary';

type Props = TextProps & {
  variant?: Variant;
  color?: string;
  muted?: boolean;
  center?: boolean;
  tone?: Tone;
};

const toneColor: Record<Tone, string> = {
  text: colors.text,
  primary: colors.primary,
  secondary: colors.textSecondary,
  muted: colors.textMuted,
  purple: colors.secondary,
  danger: colors.error,
  error: colors.error,
  warning: colors.warning,
  white: colors.white,
  onPrimary: colors.onPrimary,
};

export function AppText({
  variant = 'body',
  color,
  muted,
  center,
  tone,
  style,
  ...rest
}: Props) {
  const resolvedColor =
    color ??
    (tone ? toneColor[tone] : muted ? colors.textSecondary : colors.text);

  return (
    <Text
      {...rest}
      style={[
        typography[variant] as TextStyle,
        { color: resolvedColor },
        center && styles.center,
        style,
      ]}
    />
  );
}

export { AppText as Text };

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
});
