import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TextInput,
  Button,
  View,
  StyleSheet,
  Text,
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

// CHANGE THIS AS YOU NEED FOR DEMO

const hostIp = "10.0.0.140";
const port = "5000";

const TableView = () => {
  const defaultWidth = 100;
  const headerData = ["Skill", "Mastery", "Date"];
  const [tableData, setTableData] = useState([
    ["Homework", 0, "2023-08-15"],
    ["Reading", 0, "2023-08-15"],
    ["Writing", 0, "2023-08-15"],
    ["Notetaking", 0, "2023-08-15"],
    ["Growth Mindset", 0, "2023-08-15"],
  ]);
  const [columnWidths, setColumnWidths] = useState(
    new Array(headerData.length).fill(0)
  );

  const calculateWidthOfContent = (content) => {
    // Placeholder function: should calculate and return the width of the content.
    return defaultWidth; // example default value
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
    calculateColumnWidths();

    axios
      .get(
        "http://" +
          hostIp +
          ":" +
          port +
          "/api/v1/students/" +
          1 +
          "/mastery-logs"
      ) //TODO INSERT USERID
      .then((response) => {
        const transformedData = response.data.map((entry) => [
          entry.skill_id,
          entry.mastery_status,
          entry.date_of_event,
        ]); // Adjust property names
        setTableData(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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
    const newRow = ["New Behavior", "0"];
    setTableData((prevData) => {
      let newData = [...prevData];
      newData.splice(index + 1, 0, newRow);
      return newData;
    });
  };

  return (
    <MenuProvider>
      <ScrollView style={tableStyles.scrollContainer}>
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
