import React, { useState } from "react";
import {
  ScrollView,
  TextInput,
  Button,
  View,
  StyleSheet,
  Text,
} from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";

const fetchData = async (id) => {
  try {
    const response = await axios.get(
      "http://192.168.4.63:5000/api/users/john.doe@example.com"
    );

    const userId = response.data.user_id;
    const response2 = await axios.get(
      "http://192.168.4.63:5000/api/behavior_events/" + userId + "/"
    );

    const missedClass = response2.data.reduce((count, behavior) => {
      if (behavior.behavior_id === 1) {
        return count + 1;
      }
      return count;
    }, 0);
    const missedCoachingMeeting = response2.data.reduce((count, behavior) => {
      if (behavior.behavior_id === 2) {
        return count + 1;
      }
      return count;
    }, 0);
    const missedAssignments = response2.data.reduce((count, behavior) => {
      if (behavior.behavior_id === 3) {
        return count + 1;
      }
      return count;
    }, 0);
    const lateAssignments = response2.data.reduce((count, behavior) => {
      if (behavior.behavior_id === 4) {
        return count + 1;
      }
      return count;
    }, 0);

    return {
      missedClass,
      missedCoachingMeeting,
      missedAssignments,
      lateAssignments,
    };
  } catch (error) {
    console.error(error);
    return {
      missedClass: null,
      missedCoachingMeeting: null,
      missedAssignments: null,
      lateAssignments: null,
    };
  }
};

// allows the user to export the table data as a CSV file using an iPhone, android

const tableView = () => {
  const [tableData, setTableData] = useState([
    ["Missed Classes", "0"],
    ["Missed Coaching Meetings", "0"],
    ["Missed Assignments", "0"],
    ["Late Assignments", "0"],
    ["Missing Assignments", "0"],
    ["Study Time Complete", "0 hr 0 min"],
    ["Study Time Required", "20 hr 0 min"],
  ]);

  const handleCellChange = (rowData, rowIndex, cellIndex, newValue) => {
    const newTableData = [...tableData];
    newTableData[rowIndex][cellIndex] = newValue;
    setTableData(newTableData);
  };

  const renderEditableCell = (data, rowIndex, cellIndex) => (
    <TextInput
      value={data}
      onChangeText={(newValue) =>
        handleCellChange(tableData, rowIndex, cellIndex, newValue)
      }
      style={tableStyles.input}
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
        <View style={tableStyles.container}>
          <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
            <Row
              data={["Behaviors", "Count"]}
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
              <View style={tableStyles.innerRowContainer}>
                <Row
                  data={rowData.map((cellData, cellIndex) =>
                    renderEditableCell(cellData, rowIndex, cellIndex)
                  )}
                  textStyle={tableStyles.cellText}
                />
              </View>
            </View>
          ))}
        </View>
        <Button title="Export as CSV" onPress={() => exportCSV(tableData)} />
      </ScrollView>
    </MenuProvider>
  );
};

const tableStyles = StyleSheet.create({
  // ... (existing styles)
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  outerRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderColor: "#c8e1ff",
  },
  innerRowContainer: {
    flex: 1,
  },
  menuTrigger: {
    padding: 10,
    fontSize: 20,
  },
  menuOptionText: {
    padding: 10,
  },
});

export default tableView;
