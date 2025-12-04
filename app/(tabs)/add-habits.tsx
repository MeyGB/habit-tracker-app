import { database, DB_ID, DB_TABLE_ID } from '@/utils/Appwrite';
import { useAuth } from '@/utils/auth-context';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { ID } from 'react-native-appwrite';
import { ActivityIndicator, Button, SegmentedButtons, Surface, Text, TextInput } from 'react-native-paper';

const freq = ["daily", "weekly", "monthly"];
type Frequency = (typeof freq)[number];

export default function AddHabitScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const { currentuser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!currentuser) return;
    setLoading(true);

    try {
      const response = await database.createDocument(DB_ID, DB_TABLE_ID, ID.unique(), {
        title,
        description,
        frequency,
        streak_count: 0,
        last_completed: new Date().toISOString(),
        user_id: currentuser.$id,
      });

      if (response) {
        setTitle("");
        setDescription("");
        router.replace('/');
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.header}>Add New Habit</Text>

      <Surface style={styles.card} elevation={4}>
        <TextInput
          style={styles.input}
          label="Title"
          mode="outlined"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          label="Description"
          mode="outlined"
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.segmentContainer}>
          <Text style={styles.segmentLabel}>Frequency</Text>

          <SegmentedButtons
            value={frequency}
            onValueChange={setFrequency}
            style={styles.segments}
            buttons={freq.map((f) => ({
              value: f,
              label: f.charAt(0).toUpperCase() + f.slice(1),
            }))}
          />
        </View>

        <Button
          mode="contained"
          style={styles.addButton}
          onPress={handleSubmit}
          disabled={!title || !description}
        >
          Add Habit
        </Button>
      </Surface>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    backgroundColor: "#f3f0ff",
    justifyContent: "center",
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 22,
    textAlign: "center",
    color: "#3c2c70",
  },

  card: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#ffffff",
  },

  input: {
    marginBottom: 16,
  },

  segmentContainer: {
    marginBottom: 20,
  },

  segmentLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },

  segments: {
    borderRadius: 12,
  },

  addButton: {
    marginTop: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
