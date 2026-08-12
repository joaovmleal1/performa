import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { getExerciseGifUrl } from '@/data/exercises';
import type { Exercise } from '@/types';
import { colors, radius } from '@/theme';

type Props = {
  exercise: Pick<Exercise, 'gifUrl' | 'driveFileId' | 'thumbnailColor' | 'name'>;
  style?: StyleProp<ViewStyle>;
  contentFit?: 'contain' | 'cover';
};

export function ExerciseGif({ exercise, style, contentFit = 'contain' }: Props) {
  const uri = getExerciseGifUrl(exercise);
  const [loading, setLoading] = useState(Boolean(uri));
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      <View
        style={[
          styles.fallback,
          { backgroundColor: exercise.thumbnailColor ?? colors.surface },
          style,
        ]}
      >
        <AppText variant="caption" color={colors.white} center>
          {failed ? 'Não foi possível carregar o GIF' : 'GIF indisponível'}
        </AppText>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.frame,
        { backgroundColor: exercise.thumbnailColor ?? colors.surfaceElevated },
        style,
      ]}
    >
      <Image
        source={{ uri }}
        style={styles.image}
        contentFit={contentFit}
        cachePolicy="memory-disk"
        recyclingKey={uri}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setFailed(true);
        }}
        accessibilityLabel={`Demonstração: ${exercise.name}`}
      />
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  fallback: {
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
});
