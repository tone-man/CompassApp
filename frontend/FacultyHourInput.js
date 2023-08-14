import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Provider as PaperProvider, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";

export default function FacultyBehaviorInput() {
  // set states for student, mastery, date, studentsList, filteredStudents
  const [student, setStudent] = useState("");
  const [mastery, setMastery] = useState("");
  const [date, setDate] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    fetchStudentNames();
  }, []);

  const theme = useTheme();

  const fetchIDFromName = async (name) => {
    try {
      // fetch user ID from name from backend and return user ID if found or an error if not found
      const response = await axios.get("http://192.168.4.63:5000/api/users");
      const user = response.data.find((user) => user.name === name);
      return user.user_id;
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const fetchStudentNames = async () => {
    // fetch student names from backend and set studentsList to list of student names from backend or an error if not found
    try {
      const response = await axios.get("http://192.168.4.63:5000/api/users");
      setStudentsList(response.data.map((user) => user.name));
    } catch (error) {
      console.error("Error fetching student names:", error);
    }
  };

  const handleStudentChange = (text) => {
    // set student to text and set filteredStudents to list of students that match text
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
    // render list of students that match text and set student to selected student
    <TouchableOpacity
      onPress={() => {
        setStudent(item);
        setFilteredStudents([]);
      }}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  const handleSave = async () => {
    // handle save button press
    const errorMessages = [];
    // check if student, mastery, and date are empty and add error message if so
    if (student === "") {
      errorMessages.push("Student is required");
    }

    if (mastery === "") {
      errorMessages.push("Mastery is required");
    }

    if (date === "") {
      errorMessages.push("Date is required");
    }

    if (errorMessages.length > 0) {
      // display error messages if any
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
      // fetch user ID from name
      const userId = await fetchIDFromName(student);
      if (userId) {
        // post request to backend
        const data = {
          user_id: userId,
          skill_id: mastery,
          mastery_status: mastery,
          date_of_event: date,
        };
        //const response = await axios.post(

        // alert user that data was saved successfully
        Alert.alert("Saved!");
      }
    }
  };

  return (
    // display form for faculty to input student mastery
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
            {filteredStudents.length > 0 && (
              <FlatList
                data={filteredStudents}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                style={styles.suggestionList}
              />
            )}
          </View>
          <Text>Date: *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={mastery}
              onChangeText={setMastery}
            />
            {mastery !== "" && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setMastery("")}
              >
                <Icon name="times-circle" size={20} color="gray" />
              </TouchableOpacity>
            )}
          </View>
          <Text>HOURS: *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="0 hr 0 min"
              value={date}
              onChangeText={setDate}
            />
            {date !== "" && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setDate("")}
              >
                <Icon name="times-circle" size={20} color="gray" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View
          style={[
            styles.buttonContainer,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Button color="white" title="SAVE" onPress={handleSave} />
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
  buttonContainer: {
    alignItems: "center",
    paddingVertical: 10,
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
});
