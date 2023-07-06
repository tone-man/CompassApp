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

export default function FacultyBehaviorInput() {
  // set states for student, behavior, date, studentsList, filteredStudents, behaviorList, filteredBehavior, dateError and behavior options
  const [student, setStudent] = useState("");
  const [behavior, setBehavior] = useState("");
  const [date, setDate] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [behaviorList, setBehaviorList] = useState([]);
  const [filteredBehavior, setFilteredBehavior] = useState([]);
  const [dateError, setDateError] = useState("");
  const behaviorOptions = behaviorList.map((behavior) => ({
    label: behavior.behavior_name,
    value: behavior.behavior_id,
  }));

  useEffect(() => {
    fetchStudentNames();
    fetchBehaviorList();
  }, []);

  const theme = useTheme();

  const fetchIDFromName = async (name) => {
    // fetch user ID from name from backend and return user ID if found or an error if not found
    try {
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

  const fetchBehaviorList = async () => {
    // fetch behavior list from backend and set behaviorList to list of behaviors from backend or an error if not found
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
    // get behavior ID from behavior name from behavior list and return behavior ID if found or null if not found
    console.log("Behavior Name:", "'" + behaviorName + "'");
    console.log("Behavior List:", behaviorList);

    const behavior = behaviorList.find(
      (behavior) => behavior.behavior_name === behaviorName
    );

    console.log("Found Behavior:", behavior);

    return behavior ? behavior.behavior_id : null;
  };

  const handleStudentChange = (text) => {
    // set student to text and set filteredStudents to list of students that match text or an empty list if text is empty
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
    // set behavior to text and set filteredBehavior to list of behaviors that match text or an empty list if text is empty
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
    // render item for student or behavior list
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
    // render item for behavior list
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
    // set date to text and set dateError to error message if date is not in the format YYYY-MM-DD or an empty string if date is in the format YYYY-MM-DD
    setDate(text);
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    //
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
      // fetch student ID from name and behavior ID from behavior name
      const student_id = await fetchIDFromName(student);
      const behavior_id = behavior;

      if (student_id && behavior_id) {
        try {
          // post request to save data
          await axios.post("http://192.168.4.63:5000/api/behavior_events", {
            userId: student_id,
            behaviorId: behavior_id,
            dateOfEvent: date,
          });
          // alert user that data was saved successfully
          Alert.alert("Data saved successfully");
        } catch (error) {
          // alert user that data was not saved successfully
          console.error("Error saving data:", error);
          console.error(
            "userId: " + student_id,
            "behaviorId: " + behavior_id,
            "dateOfEvent: " + date
          );
          Alert.alert("Error saving data");
        }
      } else {
        // alert user that student or skill was not found
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
    // render form for faculty behavior input
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
          <View style={styles.scrollSelect}>
            <RNPickerSelect
              value={behavior}
              onValueChange={(value) => setBehavior(value)}
              items={behaviorOptions}
            />
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
  scrollSelect: {
    position: "relative",
    borderWidth: 1,
    borderColor: "#bbb",
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
