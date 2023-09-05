import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TextInput,
  Button,
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Table, Row } from "react-native-table-component";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";
import axios from "axios";
import { ip, hostPort } from "./globals.js";

const hostIp = ip;
const port = hostPort;
const TableView = () => {
  const defaultWidth = 100;
  const headerData = ["Id", "Skill", "Mastery", "Date"];
  const [tableData, setTableData] = useState([
    ["-", "------", "-", "0000-00-00"],
  ]);
  const [columnWidths, setColumnWidths] = useState(
    new Array(headerData.length).fill(0)
  );

  const calculateWidthOfContent = (content) => {
    return defaultWidth;
  };

  const calculateColumnWidths = () => {
    let maxWidths = [...columnWidths];
    headerData.forEach((header, index) => {
      const width = calculateWidthOfContent(header);
      maxWidths[index] = Math.max(maxWidths[index], width);
    });

    tableData.forEach((row) => {
      row.forEach((cell, index) => {
        const width = calculateWidthOfContent(String(cell));
        maxWidths[index] = Math.max(maxWidths[index], width);
      });
    });

    setColumnWidths(maxWidths);
  };

  useEffect(() => {
    fetchStudentNames();
  }, []);

  const addRowBelow = async (index) => {
    try {
      var id = await fetchStudentId(student);
      const response = await axios.post(
        "http://" + hostIp + ":" + port + "/api/v1/mastery-logs",
        {
          userId: id,
          skillId: 1,
          masteryStatus: 0,
          dateOfEvent: "1970-01-01",
        }
      );
      const addedRow = [response.data.id, "1", "0", "1970-01-01"]; // Assuming the API returns the added row
      setTableData((prevData) => {
        let newData = [...prevData];
        newData.push(addedRow);
        return newData;
      });
      console.log("Row added successfully");
    } catch (error) {
      console.error("Error adding row:", JSON.stringify(error));
    }
  };

  const handleCellChange = (rowIndex, cellIndex, newValue) => {
    setTableData((prevTableData) => {
      const updatedData = [...prevTableData];
      updatedData[rowIndex][cellIndex] = newValue;
      return updatedData;
    });
  };

  const handleCellBlur = (rowIndex, cellIndex, oldValue) => {
    const newValue = tableData[rowIndex][cellIndex];
    console.log(oldValue, newValue);
    setEditedRows((prevEditedRows) => [
      ...prevEditedRows,
      { rowIndex, cellIndex },
    ]);
  };

  const [editedRows, setEditedRows] = useState([]);

  useEffect(() => {
    // Update edited rows
    editedRows.forEach(async (edit) => {
      const { rowIndex, cellIndex } = edit;
      const id = await fetchStudentId(student);
      //console.log();
      try {
        await axios.put(
          `http://${hostIp}:${port}/api/v1/mastery-logs/${id}`,
          {
            userId: id,
            skillId: tableData[rowIndex][1],
            masteryStatus: tableData[rowIndex][2],
            dateOfEvent: tableData[rowIndex][3],
          } // Assuming headerData corresponds to API field names
        );
        console.log("Row updated successfully");
      } catch (error) {
        console.error("Error updating row:", error.response.data);
      }
    });
  }, [editedRows]);

  const getMasterTableData = async (studentID) => {
    calculateColumnWidths();
    fetchStudentNames();
    await axios
      .get(
        "http://" +
          hostIp +
          ":" +
          port +
          "/api/v1/students/" +
          studentID +
          "/mastery-logs"
      )
      .then((response) => {
        const transformedData = response.data.map((entry) => [
          entry.entry_id,
          entry.skill_id,
          entry.mastery_status,
          entry.date_of_event,
        ]);
        setTableData(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const renderEditableCell = (data, rowIndex, cellIndex) => (
    <TextInput
      value={String(data)}
      onChangeText={(newValue) => {
        handleCellChange(rowIndex, cellIndex, newValue);
      }}
      onBlur={() => handleCellBlur(rowIndex, cellIndex, data)}
      style={{
        ...tableStyles.input,
        width: columnWidths[cellIndex] || defaultWidth,
      }}
    />
  );

  const deleteRow = async (id) => {
    // Remove the row from the local state
    const updatedTableData = tableData.filter((row) => row[0] !== id);
    setTableData(updatedTableData);

    try {
      // Send a DELETE request to the API to delete the row
      await axios.delete(
        "http://" + hostIp + ":" + port + "/api/v1/mastery-logs/" + id
      );
      console.log("Row deleted successfully");
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [student, setStudent] = useState("");
  const [filteredStudent, setFilteredStudent] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const fetchStudentNames = async () => {
    try {
      const response = await axios.get(
        `http://${hostIp}:${port}/api/v1/students/`
      );
      setStudentsList(response.data.map((user) => user.name));
    } catch (error) {
      console.error("Error fetching student names:", error);
    }
  };

  const fetchStudentId = async (studentName) => {
    try {
      const response = await axios.get(
        `http://${hostIp}:${port}/api/v1/students`
      );
      const student = response.data.find((user) => user.name === studentName);
      console.log("student", student);
      console.log("student ID", student.user_id);
      return student.user_id;
    } catch (error) {
      console.error("Error fetching student id:", error);
    }
  };

  const handleStudentChange = (text) => {
    setStudent(text);
    const matchedStudents = studentsList.filter((s) =>
      s.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredStudents(matchedStudents);
  };

  const handleStudentSelection = async (selected) => {
    setStudent(selected);
    console.log("selected", selected);
    // make a student id variable
    var studentId = await fetchStudentId(selected);
    getMasterTableData(studentId);

    setFilteredStudents([]); // Clear the filtered students list
  };

  const removeStudent = () => {
    setSelectedStudent(null);
  };

  const renderSelectedStudent = () => (
    <View style={styles.selectedStudentContainer}>
      <Text>{selectedStudent}</Text>
      <TouchableOpacity onPress={removeStudent}>
        <Icon name="times-circle" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity onPress={async () => await handleStudentSelection(item)}>
      <Text style={{ color: student === item ? "red" : "black" }}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <MenuProvider>
      <ScrollView style={tableStyles.scrollContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search and select a student"
            onChangeText={handleStudentChange}
            value={student}
          />
          {student !== "" && filteredStudents.length > 0 && (
            <FlatList
              data={filteredStudents}
              renderItem={renderStudentItem}
              keyExtractor={(item) => item}
              style={styles.suggestionList}
            />
          )}
        </View>

        {selectedStudent && renderSelectedStudent()}

        <ScrollView horizontal={true}>
          <View style={tableStyles.container}>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
              <Row
                data={headerData.map((header, index) => (
                  <Text style={{ width: columnWidths[index] || defaultWidth }}>
                    {header}
                  </Text>
                ))}
                style={tableStyles.header}
                textStyle={tableStyles.headerText}
              />
            </Table>
            {tableData.map((rowData, rowIndex) => (
              <View style={tableStyles.outerRowContainer} key={rowData[0]}>
                <Menu>
                  <MenuTrigger>
                    <Text style={tableStyles.menuTrigger}>⋮</Text>
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption onSelect={() => addRowBelow(rowData[0])}>
                      <Text style={tableStyles.menuOptionText}>
                        Add Row Below
                      </Text>
                    </MenuOption>
                    <MenuOption onSelect={() => deleteRow(rowData[0])}>
                      <Text style={tableStyles.menuOptionText}>Delete Row</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
                <View style={tableStyles.rowContainer}>
                  {rowData.map((cellData, cellIndex) => (
                    <View
                      style={{
                        ...tableStyles.cellText,
                        width: columnWidths[cellIndex] || defaultWidth,
                      }}
                      key={cellIndex}
                    >
                      {renderEditableCell(cellData, rowIndex, cellIndex)}
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        {/* <Button title="Export as CSV" onPress={() => exportCSV(tableData)} /> */}
      </ScrollView>
    </MenuProvider>
  );
};

const tableStyles = StyleSheet.create({
  // ... [Previous Styles]
  menuTrigger: {
    padding: 10,
    fontSize: 20,
  },
  menuOptionText: {
    padding: 10,
  },
  outerRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderColor: "#c8e1ff",
  },
  rowContainer: {
    flexDirection: "row",
    flex: 1,
  },
});

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

export default TableView;
