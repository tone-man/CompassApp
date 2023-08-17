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
import RNPickerSelect from "react-native-picker-select";
import { ip, hostPort } from "./globals.js";

const hostIp = ip;
const port = hostPort;

export default function FacultyMasteryInput() {
  // set states for student, mastery, masteryLevel, date, studentsList, filteredStudents,
  // masteryList, filteredMastery, masteryLevelError, dateError
  const [student, setStudent] = useState("");
  const [mastery, setMastery] = useState("");
  const [masteryLevel, setMasteryLevel] = useState("");
  const [date, setDate] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [masteryList, setMasteryList] = useState([]);
  const [filteredMastery, setFilteredMastery] = useState([]);
  const [masteryLevelError, setMasteryLevelError] = useState("");
  const [dateError, setDateError] = useState("");
  const masteryOptions = masteryList.map((mastery) => ({
    label: mastery.skill_name,
    value: mastery.skill_id,
  }));

  useEffect(() => {
    fetchStudentNames();
    fetchMasteryList();
  }, []);

  const theme = useTheme();

  const fetchIDFromName = async (name) => {
    // fetch user ID from name
    try {
      const response = await axios.get(
        "http://" + hostIp + ":" + port + "/api/v1/students/"
      );
      const user = response.data.find((user) => user.name === name);
      return user.user_id;
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const fetchStudentNames = async () => {
    // fetch student names from backend
    try {
      const response = await axios.get(
        "http://" + hostIp + ":" + port + "/api/v1/students/"
      );
      setStudentsList(response.data.map((user) => user.name));
    } catch (error) {
      console.error("Error fetching student names:", error);
    }
  };

  const fetchMasteryList = async () => {
    // fetch mastery list from backend
    try {
      const response = await axios.get(
        "http://" + hostIp + ":" + port + "/api/v1/skills"
      );
      setMasteryList(response.data);
    } catch (error) {
      console.error("Error fetching mastery list:", error);
    }
  };

  const getSkillIdFromName = (skillName) => {
    // get skill ID from skill name in mastery list
    const skill = masteryList.find((skill) => skill.skill_name === skillName);
    return skill ? skill.skill_id : null;
  };

  const handleStudentChange = (text) => {
    // handle student name change and filter student list
    setStudent(text);
    if (text !== "") {
      const filtered = studentsList.filter(
        (student) =>
          typeof student === "string" &&
          student.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
    setMasteryLevel(""); // Reset Mastery Level when changing the student
  };

  const handleMasteryChange = (text) => {
    // handle mastery change and filter mastery list
    setMastery(text);
    if (text !== "") {
      const filtered = masteryList.filter(
        (mastery) =>
          typeof mastery === "string" &&
          mastery.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredMastery(filtered);
    } else {
      setFilteredMastery([]);
    }
  };

  const renderItem = ({ item }) => (
    // render student item and set student
    <TouchableOpacity
      onPress={() => {
        setStudent(item);
        setFilteredStudents([]);
      }}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  const renderMasteryItem = ({ item }) => (
    // render mastery item and set mastery
    <TouchableOpacity
      onPress={() => {
        setMastery(item);
        setFilteredMastery([]);
      }}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  const handleMasteryLevelChange = (text) => {
    // handle mastery level change and set mastery level error if invalid
    setMasteryLevel(text);
    const masteryLevelValue = parseFloat(text);

    if (isNaN(masteryLevelValue) || masteryLevelValue > 5.0) {
      setMasteryLevelError(
        "Mastery Level must be a valid number no more than 5.0"
      );
    } else {
      setMasteryLevelError("");
    }
  };

  const handleDateChange = (text) => {
    // handle date change and set date error if invalid
    setDate(text);
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateFormatRegex.test(text)) {
      setDateError("Date must be in the format YYYY-MM-DD");
    } else {
      setDateError("");
    }
  };

  const handleSave = async () => {
    // handle save and set mastery level error and date error if invalid or missing
    // check if student ID and skill ID are valid
    if (!masteryLevel) {
      setMasteryLevelError("Mastery Level is required");
    } else if (isNaN(masteryLevel)) {
      setMasteryLevelError("Mastery Level must be a number");
    } else if (!date) {
      setDateError("Date is required");
    } else {
      setMasteryLevelError("");
      setDateError("");
      // fetch student ID and skill ID
      const student_id = await fetchIDFromName(student);
      const skill_id = mastery;
      // check if student ID and skill ID are valid
      if (student_id && skill_id) {
        try {
          // post request to backend
          await axios.post(
            "http://" + hostIp + ":" + port + "/api/v1/skill-mastery",
            {
              userId: student_id,
              skillId: skill_id,
              masteryStatus: masteryLevel,
              dateOfEvent: date,
            }
          );
          // alert the user that the data has been saved
          Alert.alert("Data saved successfully");
        } catch (error) {
          // alert the user that there was an error saving the data
          console.error("Error saving data:", error);
          console.error(
            "userId: " + student_id,
            "skillId: " + skill_id,
            "masteryStatus: " + masteryLevel,
            "dateOfEvent: " + date
          );
          Alert.alert("Error saving data");
        }
      } else {
        // alert the user that the student or skill was not found
        Alert.alert(
          "Cannot find data for student or skill. Please check again."
        );
      }
    }
  };

  return (
    // display form for inputting mastery data
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
          <Text>Mastery: *</Text>
          <View style={styles.inputContainer}>
            <RNPickerSelect
              value={mastery}
              onValueChange={(value) => setMastery(value)}
              items={masteryOptions}
            />
          </View>
          <Text>Mastery Level: *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search"
              value={masteryLevel}
              onChangeText={handleMasteryLevelChange}
              keyboardType="numeric"
            />
            {masteryLevelError !== "" && (
              <Text style={styles.errorText}>{masteryLevelError}</Text>
            )}
          </View>
          <Text>Date: *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={handleDateChange}
            />
            {dateError !== "" && (
              <Text style={styles.errorText}>{dateError}</Text>
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
  errorText: {
    color: "red",
    marginTop: 5,
  },
});
