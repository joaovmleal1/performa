import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { getExerciseGifUrl } from '@/data/exercises';
import type { Exercise } from '@/types';
import { colors, radius } from '@/theme';

type Props = {
  exercise: Pick<Exercise, 'id' | 'gifUrl' | 'driveFileId' | 'thumbnailColor' | 'name'>;
  style?: StyleProp<ViewStyle>;
  contentFit?: 'contain' | 'cover';
};

function candidateUrls(exercise: Props['exercise']): string[] {
  const primary = getExerciseGifUrl(exercise);
  const localGif = `/exercises/${exercise.id}.gif`;
  const localJpg = `/exercises/${exercise.id}.jpg`;
  const drive = exercise.gifUrl
    ?? (exercise.driveFileId
      ? `https://lh3.googleusercontent.com/d/${exercise.driveFileId}`
      : undefined);

  const list = [primary, localGif, localJpg, drive].filter(Boolean) as string[];
  return [...new Set(list)];
}

export function ExerciseGif({ exercise, style, contentFit = 'contain' }: Props) {
  const urls = candidateUrls(exercise);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(urls.length > 0);
  const uri = urls[index];

  useEffect(() => {
    setIndex(0);
    setLoading(urls.length > 0);
  }, [exercise.id]);

  if (!uri) {
    return (
      <View
        style={[
          styles.fallback,
          { backgroundColor: exercise.thumbnailColor ?? colors.surface },
          style,
        ]}
      >
        <AppText variant="caption" color={colors.white} center>
          GIF indisponível
        </AppText>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.frame,
        { backgroundColor: '#ffffff' },
        style,
      ]}
    >
      <Image
        key={uri}
        source={{ uri }}
        style={styles.image}
        contentFit={contentFit}
        cachePolicy="memory-disk"
        recyclingKey={`${exercise.id}:${uri}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          if (index < urls.length - 1) {
            setIndex((i) => i + 1);
            setLoading(true);
            return;
          }
          setLoading(false);
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
    borderWidth: 1,
    borderColor: colors.borderSubtle,
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
