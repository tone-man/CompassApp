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

  useEffect(() => {
    fetchStudentNames();
    fetchMasteryList();
  }, []);

  const theme = useTheme();

  const fetchIDFromName = async (name) => {
    try {
      const response = await axios.get("http://192.168.4.63:5000/api/users");
      const user = response.data.find((user) => user.name === name);
      return user.user_id;
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const fetchStudentNames = async () => {
    try {
      const response = await axios.get("http://192.168.4.63:5000/api/users");
      setStudentsList(response.data.map((user) => user.name));
    } catch (error) {
      console.error("Error fetching student names:", error);
    }
  };

  const fetchMasteryList = async () => {
    try {
      const response = await axios.get("http://192.168.4.63:5000/api/skills");
      setMasteryList(response.data);
    } catch (error) {
      console.error("Error fetching mastery list:", error);
    }
  };

  const getSkillIdFromName = (skillName) => {
    const skill = masteryList.find((skill) => skill.skill_name === skillName);
    return skill ? skill.skill_id : null;
  };

  const handleStudentChange = (text) => {
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
    setMasteryLevel(text);
    const masteryLevelValue = parseFloat(text);

    if (isNaN(masteryLevelValue) || masteryLevelValue > 5.0) {
      setMasteryLevelError("Mastery Level must be a valid number at most 5.0");
    } else {
      setMasteryLevelError("");
    }
  };

  const handleDateChange = (text) => {
    setDate(text);
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateFormatRegex.test(text)) {
      setDateError("Date must be in the format YYYY-MM-DD");
    } else {
      setDateError("");
    }
  };

  const handleSave = async () => {
    const errorMessages = [];

    if (student === "") {
      errorMessages.push("Student is required");
    }

    if (mastery === "") {
      errorMessages.push("Mastery is required");
    }

    if (masteryLevel === "") {
      errorMessages.push("Mastery Level is required");
    }

    if (date === "") {
      errorMessages.push("Date is required");
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
      const userId = await fetchIDFromName(student);
      const skill_id = getSkillIdFromName(mastery);
      console.log(userId, skill_id);
      if (userId && skill_id) {
        const data = {
          user_id: userId,
          skill_id: skill_id,
          mastery_status: masteryLevel,
          date_of_event: date,
        };
        console.log(data);
        Alert.alert("Saved!");
      }
    }
  };

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
            <TextInput
              style={styles.input}
              placeholder="Search"
              value={mastery}
              onChangeText={handleMasteryChange}
            />
            {mastery !== "" && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setMastery("")}
              >
                <Icon name="times-circle" size={20} color="gray" />
              </TouchableOpacity>
            )}
            {filteredMastery.length > 0 && (
              <FlatList
                data={filteredMastery}
                renderItem={renderMasteryItem}
                keyExtractor={(item) => item}
                style={styles.suggestionList}
              />
            )}
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
