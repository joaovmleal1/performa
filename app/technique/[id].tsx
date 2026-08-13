import { useVideoPlayer, VideoView } from 'expo-video';
import { useLocalSearchParams } from 'expo-router';
import { createElement, useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card, Screen, ScreenHeader } from '@/components/ui';
import {
  formMuscleLabels,
  formTypeLabels,
  resolveFormLesson,
} from '@/data/form';
import { colors, radius, spacing } from '@/theme';

export default function TechniqueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = resolveFormLesson(id);

  if (!lesson) {
    return (
      <Screen>
        <ScreenHeader title="Técnica" showBack />
        <AppText muted center>
          Vídeo não encontrado.
        </AppText>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <ScreenHeader title={lesson.name} showBack />

      <View style={styles.meta}>
        <Pill label={formTypeLabels[lesson.formType]} accent />
        <Pill label={formMuscleLabels[lesson.muscleGroup]} />
      </View>

      <AppText variant="body" muted style={styles.summary}>
        {lesson.summary}
      </AppText>

      <FormVideo uri={lesson.videoUrl} previewUrl={lesson.previewUrl} title={lesson.name} />

      {lesson.doTips.length > 0 ? (
        <Card style={styles.section}>
          <AppText variant="h3" color={colors.primary}>
            Como fazer
          </AppText>
          {lesson.doTips.map((tip) => (
            <AppText key={tip} variant="body" muted>
              ✓ {tip}
            </AppText>
          ))}
        </Card>
      ) : null}

      {lesson.dontTips.length > 0 ? (
        <Card style={styles.section}>
          <AppText variant="h3" color="#FF6B6B">
            Como não fazer
          </AppText>
          {lesson.dontTips.map((tip) => (
            <AppText key={tip} variant="body" muted>
              ✕ {tip}
            </AppText>
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}

function FormVideo({
  uri,
  previewUrl,
  title,
}: {
  uri: string;
  previewUrl: string;
  title: string;
}) {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.playerWrap}>
        {createElement('iframe', {
          src: previewUrl,
          title,
          allow: 'autoplay; encrypted-media; fullscreen',
          allowFullScreen: true,
          style: {
            width: '100%',
            height: '100%',
            border: 'none',
          },
        })}
      </View>
    );
  }

  return <NativeFormVideo uri={uri} />;
}

function NativeFormVideo({ uri }: { uri: string }) {
  const [playing, setPlaying] = useState(true);
  const player = useVideoPlayer(uri, (instance) => {
    instance.loop = true;
    instance.muted = true;
    instance.play();
  });

  useEffect(() => {
    const sub = player.addListener('playingChange', ({ isPlaying }) => {
      setPlaying(isPlaying);
    });
    return () => sub.remove();
  }, [player]);

  return (
    <View style={styles.playerWrap}>
      <VideoView
        style={styles.video}
        player={player}
        contentFit="contain"
        nativeControls
        fullscreenOptions={{ enable: true }}
      />
      <Pressable
        style={styles.playBtn}
        onPress={() => {
          if (player.playing) player.pause();
          else player.play();
        }}
      >
        <AppText variant="caption" color={colors.white}>
          {playing ? 'Pausar' : 'Reproduzir'}
        </AppText>
      </Pressable>
    </View>
  );
}

function Pill({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <View style={[styles.pill, accent && { backgroundColor: colors.primaryMuted }]}>
      <AppText variant="caption" color={accent ? colors.primary : colors.textMuted}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceHighlight,
  },
  summary: { marginBottom: spacing.lg },
  playerWrap: {
    width: '100%',
    aspectRatio: 9 / 16,
    maxHeight: 480,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  video: { width: '100%', height: '100%' },
  playBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  section: { gap: spacing.sm, marginBottom: spacing.lg },
});
