import React, { useState, useEffect, useContext } from "react";
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
import { DataContext } from "./DataContext.js";

const hostIp = ip;
const port = hostPort;

export default function FacultyBehaviorInput() {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedBehaviors, setSelectedBehaviors] = useState([]);
  const [date, setDate] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [behaviorList, setBehaviorList] = useState([]);
  const [filteredBehavior, setFilteredBehavior] = useState([]);
  const [dateError, setDateError] = useState("");
  const { refreshData, setRefreshData } = useContext(DataContext);

  useEffect(() => {
    fetchStudentNames();
    fetchBehaviorList();
  }, []);

  const theme = useTheme();

  const fetchStudentNames = async () => {
    try {
      const response = await axios.get(
        "http://" + hostIp + ":" + port + "/api/v1/students/"
      );
      setStudentsList(response.data.map((user) => user.name));
    } catch (error) {
      console.error("Error fetching student names:", error);
    }
  };
  const getBehaviorIdFromName = async (behaviorName) => {
    try {
      const response = await axios.get(
        "http://" + hostIp + ":" + port + "/api/v1/behaviors/"
      );
      console.log("response.data: " + response.data);
      // search the objects in the response object

      const behavior = response.data.find(
        (behavior) => behavior.behavior_name === behaviorName
      );
      console.log("Is the id of the behavior" + JSON.stringify(behavior) + "?");
      return behavior.behavior_id;
    } catch (error) {
      console.error("Error fetching behavior ID:", error);
      return null;
    }
  };

  const fetchBehaviorList = async () => {
    try {
      const response = await axios.get(
        "http://" + hostIp + ":" + port + "/api/v1/behaviors"
      );
      setBehaviorList(response.data.map((b) => b.behavior_name));
    } catch (error) {
      console.error("Error fetching behavior list:", error);
    }
  };

  const fetchIDFromName = async (name) => {
    try {
      const response = await axios.get(
        "http://" + hostIp + ":" + port + "/api/v1/students/"
      );
      const user = response.data.find((user) => user.name === name);
      return user ? user.user_id : null;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  };

  const handleClearAll = () => {
    setSelectedStudents([]);
    setSelectedBehaviors([]);
    setDate("");
    setDateError("");
  };

  const handleStudentSelection = (student) => {
    if (selectedStudents.includes(student)) {
      setSelectedStudents((prev) =>
        prev.filter((existingStudent) => existingStudent !== student)
      );
    } else {
      setSelectedStudents((prev) => [...prev, student]);
    }
    setFilteredStudents([]);
  };

  const handleStudentSearch = (text) => {
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

  const handleBehaviorSelection = (behaviorName) => {
    if (selectedBehaviors.includes(behaviorName)) {
      setSelectedBehaviors((prev) =>
        prev.filter((existingBehavior) => existingBehavior !== behaviorName)
      );
    } else {
      setSelectedBehaviors((prev) => [...prev, behaviorName]);
    }
    setFilteredBehavior([]);
  };

  const handleBehaviorSearch = (text) => {
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
    if (!date) {
      setDateError("Date is required");
    } else {
      setDateError("");
      for (let student of selectedStudents) {
        for (let behavior of selectedBehaviors) {
          try {
            const student_id = await fetchIDFromName(student);
            const behavior_id = await getBehaviorIdFromName(behavior);
            // print behavior
            console.log("behavior: " + behavior);
            console.log("behavior_id: " + behavior_id);

            if (student_id && behavior_id) {
              await axios.post(
                "http://" + hostIp + ":" + port + "/api/v1/behavior-logs",
                {
                  userId: student_id,
                  behaviorId: behavior_id,
                  dateOfEvent: date,
                }
              );
            } else {
              Alert.alert(
                "Cannot find data for student or behavior. Please check again."
              );
            }
          } catch (error) {
            console.error("Error saving data:", error.response.data);
            Alert.alert("Error saving data");
          }
        }
      }
      setSelectedStudents([]);
      setSelectedBehaviors([]);
      setRefreshData(true);
      Alert.alert("Data saved successfully");
    }
  };

  const removeStudent = (studentName) => {
    setSelectedStudents((prev) =>
      prev.filter((student) => student !== studentName)
    );
  };

  const removeBehavior = (behaviorName) => {
    setSelectedBehaviors((prev) =>
      prev.filter((behavior) => behavior !== behaviorName)
    );
  };

  const renderSelectedStudent = (student) => (
    <View key={student} style={styles.selectedStudentContainer}>
      <Text>{student}</Text>
      <TouchableOpacity onPress={() => removeStudent(student)}>
        <Icon name="times-circle" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );

  const renderSelectedBehavior = (behavior) => (
    <View key={behavior} style={styles.selectedBehaviorContainer}>
      <Text>{behavior}</Text>
      <TouchableOpacity onPress={() => removeBehavior(behavior)}>
        <Icon name="times-circle" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleStudentSelection(item)}>
      <Text
        style={{ color: selectedStudents.includes(item) ? "red" : "black" }}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderBehaviorItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleBehaviorSelection(item)}>
      <Text
        style={{ color: selectedBehaviors.includes(item) ? "red" : "black" }}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text>Students: *</Text>
          <View style={styles.selectedStudents}>
            {selectedStudents.map((student) => renderSelectedStudent(student))}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search and select students"
              onChangeText={handleStudentSearch}
            />
            {filteredStudents.length > 0 && (
              <FlatList
                data={filteredStudents}
                renderItem={renderStudentItem}
                keyExtractor={(item) => item}
                style={styles.suggestionList}
              />
            )}
          </View>
          <Text>Behaviors: *</Text>
          <View style={styles.selectedBehaviors}>
            {selectedBehaviors.map((behavior) =>
              renderSelectedBehavior(behavior)
            )}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search and select behaviors"
              onChangeText={handleBehaviorSearch}
            />
            {filteredBehavior.length > 0 && (
              <FlatList
                data={filteredBehavior}
                renderItem={renderBehaviorItem}
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
          <Button color="white" title="CLEAR ALL" onPress={handleClearAll} />
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
  buttonContainer: {
    alignItems: "center",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
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
  selectedStudents: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  selectedStudentContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e1e1e1",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  selectedBehaviors: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  selectedBehaviorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e1e1e1",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
  },
});
