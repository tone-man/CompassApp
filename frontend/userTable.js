import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TextInput,
  Button,
  View,
  StyleSheet,
  Text,
  Dimensions,
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
  const headerData = ["User ID", "Name", "Email", "Role ID"];

  const calculateWidthOfContent = (content) => {
    const estimatedWidth = content.length * 15 + 30;
    return Math.max(defaultWidth, estimatedWidth);
  };

  const initialColumnWidths = headerData.map(calculateWidthOfContent);

  const [tableData, setTableData] = useState([
    ["-", "loading@example.com", "-"],
  ]);
  const [columnWidths, setColumnWidths] = useState(initialColumnWidths);

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

  useEffect(() => {
    adjustColumnWidths();

    axios
      .get("http://" + hostIp + ":" + port + "/api/v1/users")
      .then((response) => {
        const transformedData = response.data.map((user) => [
          user.user_id,
          user.name,
          user.email,
          user.role_id,
        ]); // Adjust property names
        setTableData(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [tableData]);

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

  const deleteRow = async (id) => {
    // Remove the row from the local state
    const updatedTableData = tableData.filter((row) => row.id !== id);
    setTableData(updatedTableData);

    try {
      // Send a DELETE request to the API to delete the row
      await axios.delete(
        "http://" + hostIp + ":" + port + "/api/v1/users/" + id
      );
      console.log("Row deleted successfully");
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const addRowBelow = async (index) => {
    try {
      const response = await axios.post(
        "http://" + hostIp + ":" + port + "/api/v1/users/",
        {
          name: "New Student",
          email: "email@example",
          userRole: 1,
        }
      );
      const addedRow = [response.id, "New Student", "email@example.com"]; // Assuming the API returns the added row
      setTableData((prevData) => {
        let newData = [...prevData];
        newData.splice(index + 1, 0, addedRow);
        return newData;
      });
      console.log("Row added successfully");
    } catch (error) {
      console.error("Error adding row:", error);
    }
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
  // ... [Other Styles]
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
