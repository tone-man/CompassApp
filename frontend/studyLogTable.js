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
import axios from "axios";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";
import { ip, hostPort } from "./globals.js";

const hostIp = ip;
const port = hostPort;

const TableView = () => {
  const screenWidth = Dimensions.get("window").width;
  const defaultWidth = 100;
  const headerData = ["Id", "Student ID", "Log In Time", "Log out Time"];
  const [tableData, setTableData] = useState([
    ["-", "-", "0000-00-00 00:00:00", "0000-00-00 00:00:00"],
  ]);
  const [columnWidths, setColumnWidths] = useState(
    headerData.map((header) => header.length * 15 + 30)
  );

  // Student search related states
  const [student, setStudent] = useState("");
  const [studentsList, setStudentsList] = useState([]);
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

  const handleStudentChange = (text) => {
    setStudent(text);
    const matchedStudents = studentsList.filter((s) =>
      s.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredStudents(matchedStudents);
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

  const handleStudentSelection = async (selected) => {
    setStudent(selected);
    setFilteredStudents([]);
    const studentID = await fetchStudentId(selected);
    await getTableData(studentID);
  };

  useEffect(() => {
    fetchStudentNames();
  }, []);
  const getTableData = async (studentID) => {
    fetchStudentNames();
    console.log("Student ID:", studentID);
    await axios
      .get(
        "http://" +
          hostIp +
          ":" +
          port +
          "/api/v1/students/" +
          studentID +
          "/study-hour-logs"
      )
      .then((response) => {
        const transformedData = response.data.map((entry) => [
          entry.entry_id,
          entry.datetime_of_sign_in,
          entry.datetime_of_sign_out,
          entry.duration_of_study,
        ]); // Adjust property names
        setTableData(transformedData);
        console.log("Table data:", tableData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const renderEditableCell = (data, rowIndex, cellIndex) => (
    <TextInput
      value={String(data)}
      onChangeText={(newValue) =>
        handleCellChange(tableData, rowIndex, cellIndex, newValue)
      }
      style={{
        ...tableStyles.input,
        width: columnWidths[cellIndex] || defaultWidth,
      }}
    />
  );

  const addRowBelow = async (index) => {
    try {
      var id = await fetchStudentId(student);
      const response = await axios.post(
        "http://" + hostIp + ":" + port + "/api/v1/study-hour-logs",
        {
          userId: id,
          dateTimeOfLogIn: "1970-01-01 0:00:00",
          dateTimeOfLogOut: "1970-01-01 0:01:00",
          durationOfStudy: "1",
        }
      );
      const addedRow = [
        response.data.id,
        id,
        "1970-01-01 0:00:00",
        "1970-01-01 0:01:00",
      ]; // Assuming the API returns the added row
      setTableData((prevData) => {
        let newData = [...prevData];
        newData.splice(index + 1, 0, addedRow);
        return newData;
      });
      console.log("Row added successfully");
    } catch (error) {
      console.error("Error adding row:", JSON.stringify(error));
    }
  };

  const deleteRow = async (id) => {
    // Remove the row from the local state
    const updatedTableData = tableData.filter((row) => row[0] !== id);
    setTableData(updatedTableData);

    try {
      // Send a DELETE request to the API to delete the row
      await axios.delete(
        "http://" + hostIp + ":" + port + "/api/v1/study-hour-logs/" + id
      );
      console.log("Row deleted successfully");
    } catch (error) {
      console.error("Error deleting row:", error);
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
      const userId = tableData[rowIndex][0];
      //console.log();
      try {
        await axios.put(
          `http://${hostIp}:${port}/api/v1/study-hour-logs/${userId}`,
          {
            userId: tableData[rowIndex][0],
            dateTimeOfLogIn: tableData[rowIndex][1],
            dateTimeOfLogOut: tableData[rowIndex][2],
            durationOfStudy: dateTimeOfLogOut - dateTimeOfLogIn,
          } // Assuming headerData corresponds to API field names
        );
        console.log("Row updated successfully");
      } catch (error) {
        console.error("Error updating row:", error.response.data);
      }
    });
  }, [editedRows]);

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
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleStudentSelection(item)}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              style={styles.suggestionList}
            />
          )}
        </View>
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

        <Button title="Export as CSV" onPress={() => exportCSV(tableData)} />
      </ScrollView>
    </MenuProvider>
  );
};

const tableStyles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flexDirection: "column",
  },
  header: {
    height: 50,
    backgroundColor: "#f1f8ff",
  },
  headerText: {
    textAlign: "center",
    fontWeight: "100",
  },
  row: {
    height: 40,
    backgroundColor: "#e7f1ff",
  },
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

export default TableView;
