import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Provider as PaperProvider, useTheme } from "react-native-paper";

export default function FacultyBehaviorInput() {
  const theme = useTheme();
  const [student, setStudent] = useState("");
  const [studentsList, setStudentsList] = useState([
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Emma Watson",
  ]); // For simplicity, using a static list
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState("");

  const validateDate = (inputDate) => {
    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    return dateRegex.test(inputDate);
  };

  const handleDateChange = (text) => {
    setDate(text);
    if (text !== "" && !validateDate(text)) {
      setDateError(" ⚠️ Invalid date format. Please use YYYY/MM/DD.");
    } else {
      setDateError("");
    }
  };

  // Function to filter student names
  const findStudent = (query) => {
    if (query === "") {
      return [];
    }
    const regex = new RegExp(`${query.trim()}`, "i");
    return studentsList.filter((student) => student.search(regex) >= 0);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setStudent(item);
        setStudentsList([]); // Clear the list by setting an empty array
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
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={student}
            onChangeText={(text) => setStudent(text)}
          />
          {student !== "" && (
            <FlatList
              data={findStudent(student)}
              renderItem={renderItem}
              keyExtractor={(item) => item}
            />
          )}
          <Text>Behavior: *</Text>
          <TextInput style={styles.input} placeholder="Search" />
          <Text>Date: *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY/MM/DD"
            value={date}
            onChangeText={handleDateChange}
          />
          {dateError !== "" && (
            <Text style={styles.errorText}>{dateError}</Text>
          )}
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
            onPress={() => console.log("Button pressed")}
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
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
