import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card, Chip, Screen, ScreenHeader } from '@/components/ui';
import { mockCalendarEvents, type CalendarEventType } from '@/data/mock';
import { colors, radius, spacing } from '@/theme';

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const TYPE_COLORS: Record<CalendarEventType, string> = {
  workout: colors.primary,
  rest: colors.textMuted,
  diet: colors.secondary,
  weight: colors.info,
  habit: colors.warning,
  pr: colors.primary,
};

const TYPE_LABELS: Record<CalendarEventType, string> = {
  workout: 'Treino',
  rest: 'Descanso',
  diet: 'Dieta',
  weight: 'Peso',
  habit: 'Hábito',
  pr: 'PR',
};

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function CalendarScreen() {
  const [cursor] = useState(() => new Date(2026, 7, 1)); // Agosto 2026
  const [selected, setSelected] = useState('2026-08-11');
  const [filter, setFilter] = useState<CalendarEventType | 'all'>('all');

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const totalDays = daysInMonth(year, month);
  const startWeekday = new Date(year, month, 1).getDay();

  const cells = useMemo(() => {
    const blanks = Array.from({ length: startWeekday }, () => null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    return [...blanks, ...days];
  }, [startWeekday, totalDays]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, typeof mockCalendarEvents> = {};
    for (const event of mockCalendarEvents) {
      map[event.date] = map[event.date] ? [...map[event.date], event] : [event];
    }
    return map;
  }, []);

  const selectedEvents = (eventsByDate[selected] ?? []).filter(
    (e) => filter === 'all' || e.type === filter,
  );

  return (
    <Screen scroll>
      <ScreenHeader title="Calendário" showBack />
      <AppText variant="h2" style={{ marginBottom: spacing.md }}>
        Agosto 2026
      </AppText>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((d, i) => (
          <AppText key={`${d}-${i}`} variant="caption" muted style={styles.weekCell}>
            {d}
          </AppText>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, index) => {
          if (!day) return <View key={`b-${index}`} style={styles.dayCell} />;
          const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const events = eventsByDate[date] ?? [];
          const isSelected = selected === date;
          return (
            <Pressable
              key={date}
              style={[styles.dayCell, isSelected && styles.daySelected]}
              onPress={() => setSelected(date)}
            >
              <AppText variant="label" color={isSelected ? colors.onPrimary : colors.white}>
                {day}
              </AppText>
              <View style={styles.dots}>
                {events.slice(0, 3).map((e) => (
                  <View
                    key={e.id}
                    style={[styles.dot, { backgroundColor: TYPE_COLORS[e.type] }]}
                  />
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.filters}>
        <Chip label="Todos" selected={filter === 'all'} onPress={() => setFilter('all')} />
        {(Object.keys(TYPE_LABELS) as CalendarEventType[]).map((type) => (
          <Chip
            key={type}
            label={TYPE_LABELS[type]}
            selected={filter === type}
            onPress={() => setFilter(type)}
          />
        ))}
      </View>

      <Card style={styles.list}>
        <AppText variant="h3">
          {selected.split('-').reverse().join('/')}
        </AppText>
        {selectedEvents.length === 0 ? (
          <AppText muted>Nenhuma atividade neste dia.</AppText>
        ) : (
          selectedEvents.map((event) => (
            <View key={event.id} style={styles.eventRow}>
              <View
                style={[styles.eventDot, { backgroundColor: TYPE_COLORS[event.type] }]}
              />
              <View style={{ flex: 1 }}>
                <AppText variant="bodyMedium">{event.title}</AppText>
                <AppText variant="caption" muted>
                  {TYPE_LABELS[event.type]}
                  {event.detail ? ` · ${event.detail}` : ''}
                </AppText>
              </View>
            </View>
          ))
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  weekRow: { flexDirection: 'row', marginBottom: spacing.sm },
  weekCell: { width: `${100 / 7}%`, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    marginBottom: 4,
  },
  daySelected: {
    backgroundColor: colors.primary,
  },
  dots: { flexDirection: 'row', gap: 2, marginTop: 2, height: 6 },
  dot: { width: 4, height: 4, borderRadius: 2 },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  list: { gap: spacing.md },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  eventDot: { width: 10, height: 10, borderRadius: 5 },
});
