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
import { Picker } from "@react-native-picker/picker";

export default function FacultyBehaviorInput() {
  const [student, setStudent] = useState("");
  const [behavior, setBehavior] = useState("");
  const [date, setDate] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [behaviorList, setBehaviorList] = useState([]);
  const [filteredBehavior, setFilteredBehavior] = useState([]);
  const [dateError, setDateError] = useState("");
  const options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];

  useEffect(() => {
    fetchStudentNames();
    fetchBehaviorList();
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

  const fetchBehaviorList = async () => {
    try {
      const response = await axios.get(
        "http://192.168.4.63:5000/api/behaviors"
      );
      setBehaviorList(response.data);
    } catch (error) {
      console.error("Error fetching behavior list:", error);
    }
  };

  const getBehaviorIdFromName = (behaviorName) => {
    console.log("Behavior Name:", "'" + behaviorName + "'");
    console.log("Behavior List:", behaviorList);

    const behavior = behaviorList.find(
      (behavior) => behavior.behavior_name === behaviorName
    );

    console.log("Found Behavior:", behavior);

    return behavior ? behavior.behavior_id : null;
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
  };

  const handleBehaviorChange = (text) => {
    setBehavior(text);
    if (text !== "") {
      const filtered = behaviorList.filter(
        (behavior) =>
          typeof behavior === "string" &&
          behavior.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredBehavior(filtered);
    } else {
      setFilteredBehavior([]);
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

  const renderBehaviorItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setBehavior(item);
        setFilteredBehavior([]);
      }}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

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
    // validation checks
    if (!date) {
      setDateError("Date is required");
    } else {
      setDateError("");

      const student_id = await fetchIDFromName(student);
      const behavior_id = getBehaviorIdFromName(behavior);

      if (student_id && behavior_id) {
        try {
          await axios.post("http://192.168.4.63:5000/api/behavior_events", {
            userId: student_id,
            behaviorId: behavior_id,
            dateOfEvent: date,
          });
          Alert.alert("Data saved successfully");
        } catch (error) {
          console.error("Error saving data:", error);
          console.error(
            "userId: " + student_id,
            "behaviorId: " + behavior_id,
            "dateOfEvent: " + date
          );
          Alert.alert("Error saving data");
        }
      } else {
        Alert.alert(
          "Cannot find data for student or skill. Please check again."
        );
        console.error(
          "userId: " + student_id,
          "skillId: " + behavior_id,
          "dateOfEvent: " + date
        );
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
          <Text>Behavior: *</Text>
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={selectedOption}
              onValueChange={(itemValue) => setSelectedOption(itemValue)}
            >
              {options.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
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
