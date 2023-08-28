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
  const headerData = ["Id", "Behavior", "Date"];
  const [tableData, setTableData] = useState([]);
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
          behavior.entry_id,
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
        "http://" + hostIp + ":" + port + "/api/v1/behavior-logs/" + id
      );
      console.log("Row deleted successfully");
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const addRowBelow = async (index) => {
    try {
      var id = await fetchStudentId(student);
      const response = await axios.post(
        "http://" + hostIp + ":" + port + "/api/v1/behavior-logs/",
        {
          userId: id,
          behaviorId: 1,
          dateOfEvent: "1970-01-01",
        }
      );
      const addedRow = [response.data.id, "1", "1970-01-01"]; // Assuming the API returns the added row
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
          `http://${hostIp}:${port}/api/v1/behavior-logs/${userId}`,
          {
            userId: tableData[rowIndex][0],
            behaviorId: tableData[rowIndex][1],
            dateOfEvent: tableData[rowIndex][2],
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
                      key={`${rowData[0]}_${cellIndex}`}
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
