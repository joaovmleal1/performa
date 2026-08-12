import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { AppButton, AppText, Card, Chip, Screen, ScreenHeader } from '@/components/ui';
import { mockProgressPhotos } from '@/data/mock';
import { colors, radius, spacing } from '@/theme';

type Angle = 'front' | 'side' | 'back';

const ANGLE_LABELS: Record<Angle, string> = {
  front: 'Frontal',
  side: 'Lateral',
  back: 'Costas',
};

export default function ProgressPhotosScreen() {
  const [beforeId, setBeforeId] = useState(mockProgressPhotos[0]?.id);
  const [afterId, setAfterId] = useState(mockProgressPhotos[1]?.id);
  const [angle, setAngle] = useState<Angle>('front');
  const [width, setWidth] = useState(0);
  const split = useSharedValue(0.5);

  const before = mockProgressPhotos.find((p) => p.id === beforeId) ?? mockProgressPhotos[0];
  const after = mockProgressPhotos.find((p) => p.id === afterId) ?? mockProgressPhotos[1];

  const beforeColor = useMemo(() => colorForAngle(before, angle), [before, angle]);
  const afterColor = useMemo(() => colorForAngle(after, angle), [after, angle]);

  const pan = Gesture.Pan().onChange((e) => {
    if (!width) return;
    const next = Math.max(0.08, Math.min(0.92, e.x / width));
    split.value = next;
  });

  const beforeStyle = useAnimatedStyle(() => ({
    width: `${split.value * 100}%`,
  }));

  const handleStyle = useAnimatedStyle(() => ({
    left: `${split.value * 100}%`,
  }));

  return (
    <Screen scroll>
      <ScreenHeader title="Fotos de progresso" showBack />
      <AppText variant="body" muted style={{ marginBottom: spacing.lg }}>
        Compare antes e depois com o slider. Placeholders visuais até o upload via Storage.
      </AppText>

      <AppText variant="label" muted>
        Ângulo
      </AppText>
      <View style={styles.chips}>
        {(Object.keys(ANGLE_LABELS) as Angle[]).map((key) => (
          <Chip
            key={key}
            label={ANGLE_LABELS[key]}
            selected={angle === key}
            onPress={() => setAngle(key)}
          />
        ))}
      </View>

      <GestureDetector gesture={pan}>
        <View
          style={styles.compare}
          onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
        >
          <View style={[styles.photo, { backgroundColor: afterColor }]}>
            <AppText variant="caption">Depois · {after.date}</AppText>
          </View>
          <Animated.View style={[styles.photoOverlay, beforeStyle, { backgroundColor: beforeColor }]}>
            <AppText variant="caption">Antes · {before.date}</AppText>
          </Animated.View>
          <Animated.View style={[styles.handle, handleStyle]} />
        </View>
      </GestureDetector>

      <Card style={styles.section}>
        <AppText variant="h3">Conjuntos</AppText>
        {mockProgressPhotos.map((set) => (
          <View key={set.id} style={styles.setRow}>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyMedium">{set.date}</AppText>
              <AppText variant="caption" muted>
                {set.note}
              </AppText>
            </View>
            <View style={styles.setActions}>
              <AppButton
                label="Antes"
                size="sm"
                variant={beforeId === set.id ? 'primary' : 'secondary'}
                fullWidth={false}
                onPress={() => setBeforeId(set.id)}
                style={styles.miniBtn}
              />
              <AppButton
                label="Depois"
                size="sm"
                variant={afterId === set.id ? 'ai' : 'secondary'}
                fullWidth={false}
                onPress={() => setAfterId(set.id)}
                style={styles.miniBtn}
              />
            </View>
          </View>
        ))}
      </Card>

      <AppButton
        label="Adicionar fotos (em breve)"
        variant="secondary"
        onPress={() => undefined}
      />
    </Screen>
  );
}

function colorForAngle(
  set: (typeof mockProgressPhotos)[number],
  angle: Angle,
) {
  if (angle === 'front') return set.frontColor;
  if (angle === 'side') return set.sideColor;
  return set.backColor;
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  compare: {
    height: 280,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    marginBottom: spacing.xl,
  },
  photo: {
    ...StyleSheet.absoluteFill,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  handle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    marginLeft: -1.5,
    backgroundColor: colors.primary,
  },
  section: { gap: spacing.md, marginBottom: spacing.xl },
  setRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
  },
  setActions: { flexDirection: 'row', gap: spacing.sm },
  miniBtn: { paddingHorizontal: 12, minWidth: 84 },
});
