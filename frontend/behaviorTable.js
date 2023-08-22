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
  const screenWidth = Dimensions.get("window").width;
  const defaultWidth = 100;
  const headerData = ["Behavior", "Date"];
  const [tableData, setTableData] = useState([
    ["Missed Class", "2023-08-15"],
    ["Missed Coaching Meeting", "2023-08-15"],
    ["Missed Assignment", "2023-08-15"],
    ["Late Assignments", "2023-08-15"],
  ]);
  const [columnWidths, setColumnWidths] = useState(
    new Array(headerData.length).fill(defaultWidth)
  );

  // Student search related states and functions
  const [student, setStudent] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    fetchStudentNames();
  }, []);

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
      return student.user_id;
    } catch (error) {
      console.error("Error fetching student id:", error);
    }
  };

  const handleStudentChange = (text) => {
    setStudent(text);
    if (text.length > 0) {
      const matchedStudents = studentsList.filter((s) =>
        s.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredStudents(matchedStudents);
    } else {
      setFilteredStudents([]);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={async () => {
        setStudent(item);
        console.log("item", JSON.stringify(await fetchStudentId(item)));
        getLogs(await fetchStudentId(item));
        setFilteredStudents([]);
      }}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );
  const calculateWidthOfContent = (content) => {
    // Placeholder function: should calculate and return the width of the content.
    return defaultWidth; // example default value
  };

  const adjustColumnWidths = () => {
    const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    if (totalWidth > screenWidth) {
      calculateColumnWidths();
    } else {
      const evenWidth = screenWidth / headerData.length;
      setColumnWidths(new Array(headerData.length).fill(evenWidth));
    }
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

  const getLogs = async (studentID) => {
    adjustColumnWidths();

    await axios
      .get(
        "http://" +
          hostIp +
          ":" +
          port +
          "/api/v1/students/" +
          studentID +
          "/behavior-logs"
      ) //TODO INSERT USERID
      .then((response) => {
        const transformedData = response.data.map((behavior) => [
          behavior.behavior_id,
          behavior.date_of_event,
        ]); // Adjust property names
        setTableData(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.response.data);
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
  const deleteRow = (indexToDelete) => {
    const newTableData = tableData.filter(
      (_, index) => index !== indexToDelete
    );
    setTableData(newTableData);
  };

  const addRowBelow = (index) => {
    const newRow = ["New Behavior", 0, 0, 0, 0, 0, 0];
    setTableData((prevData) => {
      let newData = [...prevData];
      newData.splice(index + 1, 0, newRow);
      return newData;
    });
  };

  return (
    <MenuProvider>
      <ScrollView style={tableStyles.scrollContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={{ borderWidth: 1, padding: 10, flex: 1 }}
            placeholder="Search for student"
            value={student}
            onChangeText={handleStudentChange}
          />
          {filteredStudents.length > 0 && (
            <FlatList
              data={filteredStudents}
              renderItem={renderItem}
              keyExtractor={(item) => item}
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
              <View style={tableStyles.outerRowContainer} key={rowIndex}>
                <Menu>
                  <MenuTrigger>
                    <Text style={tableStyles.menuTrigger}>⋮</Text>
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption onSelect={() => addRowBelow(rowIndex)}>
                      <Text style={tableStyles.menuOptionText}>
                        Add Row Below
                      </Text>
                    </MenuOption>
                    <MenuOption onSelect={() => deleteRow(rowIndex)}>
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

export default TableView;
