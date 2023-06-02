import React from "react";
import { StyleSheet } from "react-native";
import { DataTable, Text } from "react-native-paper";

const TableExample = () => {
  return (
    <DataTable style={styles.container}>
      <DataTable style={styles.graph}>
        <DataTable.Header>
          <DataTable.Title>Behaviors</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>Missed Classes</DataTable.Cell>
          <DataTable.Cell numeric>5</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Missed Coaching Meetings</DataTable.Cell>
          <DataTable.Cell numeric>9</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Missed Assignments</DataTable.Cell>
          <DataTable.Cell numeric>3</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </DataTable>
  );
};

export default TableExample;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  graph: {
    marginVertical: "2.5%",
    marginBottom: "2.5%",
    borderRadius: 20,
    backgroundColor: "#00e6ff",
  },
  tableHeader: {
    backgroundColor: "#0000FF",
    flexWrap: "wrap",
  },
  tableTitle: {
    flexGrow: 1,
    flexWrap: "wrap",
  },
  tableHeaderText: {
    color: "yellow",
    fontWeight: "bold",
    fontSize: 10,
  },
  tableCellText: {
    color: "black",
  },
});
