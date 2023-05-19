import React from "react";
import { StyleSheet } from "react-native";
import { DataTable, Text } from "react-native-paper";

const TableExample = () => {
  return (
    <DataTable style={styles.container}>
      <DataTable.Header style={styles.tableHeader}>
        <DataTable.Title style={styles.tableTitle}>
          <Text style={styles.tableHeaderText}>Hours Logged</Text>
        </DataTable.Title>
        <DataTable.Title style={styles.tableTitle}>
          <Text style={styles.tableHeaderText}>Missed Classes</Text>
        </DataTable.Title>
        <DataTable.Title style={styles.tableTitle}>
          <Text style={styles.tableHeaderText}>Missed HW</Text>
        </DataTable.Title>
        <DataTable.Title style={styles.tableTitle}>
          <Text style={styles.tableHeaderText}>Missed Coaching</Text>
        </DataTable.Title>
        <DataTable.Title style={styles.tableTitle}>
          <Text style={styles.tableHeaderText}>Required Study</Text>
        </DataTable.Title>
        <DataTable.Title style={styles.tableTitle}>
          <Text style={styles.tableHeaderText}>Hours Owed</Text>
        </DataTable.Title>
      </DataTable.Header>
      <DataTable.Row>
        <DataTable.Cell>
          <Text style={styles.tableCellText}>15</Text>
        </DataTable.Cell>
        <DataTable.Cell>
          <Text style={styles.tableCellText}>2</Text>
        </DataTable.Cell>
        <DataTable.Cell>
          <Text style={styles.tableCellText}>3</Text>
        </DataTable.Cell>
        <DataTable.Cell>
          <Text style={styles.tableCellText}>0</Text>
        </DataTable.Cell>
        <DataTable.Cell>
          <Text style={styles.tableCellText}>20</Text>
        </DataTable.Cell>
        <DataTable.Cell>
          <Text style={styles.tableCellText}>10</Text>
        </DataTable.Cell>
      </DataTable.Row>
    </DataTable>
  );
};

export default TableExample;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  tableHeader: {
    backgroundColor: "#0000FF",
  },
  tableTitle: {
    flexGrow: 1,
  },
  tableHeaderText: {
    color: "yellow",
    fontWeight: "bold",
    fontSize: 10,
    includeFontPadding: false,
  },
  tableCellText: {
    color: "black",
  },
});
