import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import { Text, TextInput, Button, Card, IconButton } from "react-native-paper";
import api from "../api";

type Task = {
  id: number;
  task: string;
};

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  const addOrUpdateTask = async () => {
    if (!task.trim()) return;
    if (editingId !== null) {
      await api.put(`/tasks/${editingId}`, { task });
      setEditingId(null);
    } else {
      await api.post("/tasks", { task });
    }
    setTask("");
    fetchTasks();
  };

  const editTask = (t: Task) => {
    setTask(t.task);
    setEditingId(t.id);
  };

  const deleteTask = async (id: number) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <View style={styles.container}>
      {/* Fondo con opacidad y degradado */}
      <View style={styles.background} />

      <Text style={styles.title}>📝 TO-DO LIST</Text>

      <View style={styles.inputRow}>
        <TextInput
          mode="outlined"
          placeholder="Add a new task..."
          value={task}
          onChangeText={setTask}
          style={styles.input}
          theme={{ colors: { text: "#fff", placeholder: "#bbb" } }}
        />
        <Button
          mode="contained"
          buttonColor="#5cc5ff" // azul tipo líquido
          textColor="#0a192f"
          style={styles.liquidButton}
          onPress={addOrUpdateTask}
        >
          {editingId !== null ? "Update" : "Add"}
        </Button>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.task}
              titleStyle={styles.cardTitle}
              right={() => (
                <View style={{ flexDirection: "row" }}>
                  <IconButton
                    icon="pencil"
                    iconColor="#ffd700"
                    onPress={() => editTask(item)}
                  />
                  <IconButton
                    icon="delete"
                    iconColor="#ff5555"
                    onPress={() => deleteTask(item.id)}
                  />
                </View>
              )}
            />
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    padding: 20,
  },
  background: {
    position: "absolute",
    width,
    height,
    backgroundColor: "#0a192f", // fondo oscuro elegante
    opacity: 0.95, // opacidad completa
    top: 0,
    left: 0,
    zIndex: -1,
  },
  title: {
    color: "#64ffda",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 32,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "rgba(255,255,255,0.05)", // input semitransparente
    color: "#fff",
  },
  liquidButton: {
    borderRadius: 50,
    elevation: 8, // efecto "liquid"
    shadowColor: "#5cc5ff",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  card: {
    marginBottom: 10,
    backgroundColor: "rgba(18,34,64,0.85)", // card semitransparente
    borderRadius: 12,
  },
  cardTitle: {
    color: "#ccd6f6",
    fontWeight: "bold",
  },
});
