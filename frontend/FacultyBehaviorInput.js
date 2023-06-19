import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import { Provider as PaperProvider, useTheme } from "react-native-paper";

export default function FacultyBehaviorInput() {
  const theme = useTheme();
  const [student, setStudent] = useState("");
  const [behavior, setBehavior] = useState("");
  const [date, setDate] = useState("");

  const handleSave = () => {
    if (student === "") {
      Alert.alert("Student is required");
      return;
    } else if (behavior === "") {
      Alert.alert("Behavior is required");
      return;
    } else if (date === "") {
      Alert.alert("Date is required");
      return;
    } else {
      Alert.alert("Saved!");
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text>Student: *</Text>
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={student}
            onChangeText={setStudent}
          />
          <Text>Behavior: *</Text>
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={behavior}
            onChangeText={setBehavior}
          />
          <Text>Date: *</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/YYYY"
            value={date}
            onChangeText={setDate}
          />
        </View>
        <View
          style={[
            styles.buttonContainer,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Button
            style={styles.button}
            color="white"
            mode="contained"
            title="SAVE"
            onPress={handleSave}
          />
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  button: {
    width: "50%",
  },
});
