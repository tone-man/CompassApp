import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Provider as PaperProvider, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";

export default function FacultyBehaviorInput() {
  const theme = useTheme();
  const [student, setStudent] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");

  useEffect(() => {
    fetchStudentNames();
  }, []);

  const fetchStudentNames = async () => {
    try {
      const response = await axios.get("http://192.168.4.63:5000/api/users");
      setStudentsList(response.data.map((user) => user.name));
    } catch (error) {
      console.error("Error fetching student names:", error);
    }
  };

  const handleSave = () => {
    const errorMessages = [];

    if (student === "") {
      errorMessages.push("Student is required");
    }

    if (date === "") {
      errorMessages.push("Date is required");
    }

    if (hours === "") {
      errorMessages.push("Hours is required");
    }

    if (errorMessages.length > 0) {
      const displayAlerts = (index) => {
        Alert.alert(errorMessages[index], "", [
          {
            text: "OK",
            onPress: () => {
              if (index + 1 < errorMessages.length) {
                displayAlerts(index + 1);
              }
            },
          },
        ]);
      };

      displayAlerts(0);
    } else {
      Alert.alert("Saved!");
    }
  };

  const handleStudentChange = (text) => {
    setStudent(text);
    if (text !== "") {
      const filtered = studentsList.filter((student) =>
        student.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => {
        setStudent(item);
        setFilteredStudents([]);
      }}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text>Student: *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search"
              value={student}
              onChangeText={handleStudentChange}
            />
            {student !== "" && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setStudent("")}
              >
                <Icon name="times-circle" size={20} color="gray" />
              </TouchableOpacity>
            )}
          </View>
          {filteredStudents.length > 0 && (
            <FlatList
              data={filteredStudents}
              renderItem={renderItem}
              keyExtractor={(item) => item}
              style={styles.suggestionList}
            />
          )}
          <Text>Behavior: *</Text>
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={date}
            onChangeText={setDate}
          />
          <Text>Hours: *</Text>
          <TextInput
            style={styles.input}
            placeholder="0 hours"
            value={hours}
            onChangeText={setHours}
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
            onPress={() => handleSave()}
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
  inputContainer: {
    position: "relative",
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 5,
    marginBottom: 10,
  },
  clearButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
  suggestionList: {
    maxHeight: 120,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  suggestionItem: {
    paddingVertical: 5,
  },
  buttonContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  button: {
    width: "50%",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
