import { Habit, HabitCompleted } from '@/types/database.type';
import { client, database, DB_COMPLETION_TABLE_ID, DB_ID, DB_TABLE_ID } from '@/utils/Appwrite';
import { useAuth } from '@/utils/auth-context';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Query } from 'react-native-appwrite';
import { ActivityIndicator, Card, Text } from 'react-native-paper';

export default function Streaks() {
  const { currentuser } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<HabitCompleted[]>([]);
  const [habitStreaks, setHabitStreaks] = useState<
    { habit: Habit; streak: number; bestStreak: number; total: number }[]
  >([]);
  const [loading, setLoading] = useState(false)

  // Fetch habits
  const fetchHabits = async () => {
    if (!currentuser) return;
    setLoading(true)
    try {
      const response = await database.listDocuments(DB_ID, DB_TABLE_ID, [
        Query.equal('user_id', currentuser.$id),
        Query.orderDesc('$createdAt'),
      ]);
      setHabits(response.documents as Habit[]);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
    setLoading(false)
  };

  // Fetch completions
  const fetchCompletions = async () => {
    if (!currentuser) return;
    setLoading(true)
    try {
      const response = await database.listDocuments(DB_ID, DB_COMPLETION_TABLE_ID, [
        Query.equal('user_id', currentuser.$id),
      ]);
      setCompletedHabits(response.documents as HabitCompleted[]);
    } catch (error) {
      console.error('Error fetching completions:', error);
    }
    setLoading(false)
  };

  // Realtime subscription for habits and completions
  useEffect(() => {
    if (!currentuser) return;

    const habitsChannel = `databases.${DB_ID}.collections.${DB_TABLE_ID}.documents`;
    const completionsChannel = `databases.${DB_ID}.collections.${DB_COMPLETION_TABLE_ID}.documents`;

    const unsubscribeHabits = client.subscribe(habitsChannel, (res: any) => {
      if (
        res.events.includes('databases.*.collections.*.documents.*.create') ||
        res.events.includes('databases.*.collections.*.documents.*.update') ||
        res.events.includes('databases.*.collections.*.documents.*.delete')
      ) {
        fetchHabits();
      }
    });

    const unsubscribeCompletions = client.subscribe(completionsChannel, (res: any) => {
      if (res.events.includes('databases.*.collections.*.documents.*.create')) {
        fetchCompletions();
      }
    });

    fetchHabits();
    fetchCompletions();

    return () => {
      unsubscribeHabits();
      unsubscribeCompletions();
    };
  }, [currentuser]);

  // Calculate streak data
  const getStreakData = (habitId: string) => {
    const habitCompletion = completedHabits
      ?.filter((c) => c.habit_id === habitId)
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());

    if (!habitCompletion || habitCompletion.length === 0) {
      return { streak: 0, bestStreak: 0, total: 0 };
    }

    let streak = 0;
    let bestStreak = 0;
    let total = habitCompletion.length;
    let lastDate: Date | null = null;
    let currentStreak = 0;

    habitCompletion.forEach((c) => {
      const date = new Date(c.completed_at);
      if (lastDate) {
        const diff = (lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
        if (diff <= 1.5) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      if (currentStreak > bestStreak) bestStreak = currentStreak;
      lastDate = date;
    });

    streak = currentStreak;
    return { streak, bestStreak, total };
  };

  // Recompute streaks whenever habits or completions change
  useEffect(() => {
    if (habits.length > 0) {
      const computedStreaks = habits.map((habit) => {
        const { streak, bestStreak, total } = getStreakData(habit.$id);
        return { habit, streak, bestStreak, total };
      });
      setHabitStreaks(computedStreaks.sort((a, b) => b.bestStreak - a.bestStreak));
    }
  }, [habits, completedHabits]);

  const badgeStyles = [styles.badge1, styles.badge2, styles.badge3];
    if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant="headlineSmall">
        Habit Streaks
      </Text>

      {habitStreaks.length > 0 && (
        <View style={styles.rankingContainer}>
          <Text style={styles.rankingTitle}>🏅 Top Streaks</Text>
          {habitStreaks.slice(0, 3).map((item, key) => (
            <View key={key} style={styles.rankingRow}>
              <View style={[styles.rankingBadge, badgeStyles[key]]}>
                <Text style={styles.rankingBadgeText}>{key + 1}</Text>
              </View>
              <Text style={styles.rankingHabit}>{item.habit.title}</Text>
              <Text style={styles.rankingStreak}>{item.bestStreak}</Text>
            </View>
          ))}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {habitStreaks.map(({ habit, streak, bestStreak, total }, key) => (
          <Card key={key} style={[styles.card, key === 0 && styles.firstCard]}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.habitTitle}>
                {habit.title}
              </Text>
              <Text style={styles.habitDescription}>{habit.description}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statBadge}>
                  <Text style={styles.statBadgeText}>🔥 {streak}</Text>
                  <Text style={styles.statLabel}>Current</Text>
                </View>
                <View style={styles.statBadgeGold}>
                  <Text style={styles.statBadgeText}>🏆 {bestStreak}</Text>
                  <Text style={styles.statLabel}>Best</Text>
                </View>
                <View style={styles.statBadgeGreen}>
                  <Text style={styles.statBadgeText}>✅ {total}</Text>
                  <Text style={styles.statLabel}>Total</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontWeight: 'bold', marginBottom: 16 },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  firstCard: { borderWidth: 2, borderColor: '#7c4dff' },
  habitTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 2 },
  habitDescription: { color: '#6c6c80', marginBottom: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginTop: 8 },
  statBadge: { backgroundColor: '#fff3e0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center', minWidth: 60 },
  statBadgeGold: { backgroundColor: '#fffde7', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center', minWidth: 60 },
  statBadgeGreen: { backgroundColor: '#e8f5e9', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center', minWidth: 60 },
  statBadgeText: { fontWeight: 'bold', fontSize: 15, color: '#22223b' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2, fontWeight: '500' },
  rankingContainer: { marginBottom: 24, backgroundColor: '#fff', borderRadius: 16, padding: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  rankingTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 12, color: '#7c4dff', letterSpacing: 0.5 },
  rankingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 8 },
  rankingBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 10, backgroundColor: '#e0e0e0' },
  badge1: { backgroundColor: '#ffd700' }, // gold
  badge2: { backgroundColor: '#c0c0c0' }, // silver
  badge3: { backgroundColor: '#cd7f32' }, // bronze
  rankingBadgeText: { fontWeight: 'bold', color: '#fff', fontSize: 15 },
  rankingHabit: { flex: 1, fontSize: 15, color: '#333', fontWeight: '600' },
  rankingStreak: { fontSize: 14, color: '#7c4dff', fontWeight: 'bold' },
    loaderContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
