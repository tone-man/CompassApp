import React from "react";
import { StyleSheet } from "react-native";
import { DataTable, Text } from "react-native-paper";
import { useTheme } from "react-native-paper";

const TableExample = () => {
  const { colors } = useTheme();
  const stylesConfig = styles(colors);

  return (
    <DataTable style={stylesConfig.graph}>
      <DataTable.Header>
        <DataTable.Title>
          <Text style={stylesConfig.tableHeaderText}>Behaviors</Text>
        </DataTable.Title>
      </DataTable.Header>

      <DataTable.Row>
        <DataTable.Cell>
          <Text style={stylesConfig.tableCellText}>Missed Classes</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={stylesConfig.tableCellText}>5</Text>
        </DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell>
          <Text style={stylesConfig.tableCellText}>
            Missed Coaching Meetings
          </Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={stylesConfig.tableCellText}>9</Text>
        </DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell>
          <Text style={stylesConfig.tableCellText}>Missed Assignments</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={stylesConfig.tableCellText}>3</Text>
        </DataTable.Cell>
      </DataTable.Row>
    </DataTable>
  );
};

export default TableExample;

const styles = (colors) =>
  StyleSheet.create({
    container: {
      padding: 15,
    },
    graph: {
      marginVertical: "2.5%",
      marginBottom: "2.5%",
      borderRadius: 20,
      backgroundColor: colors.primary,
    },
    graphText: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    tableHeader: {
      backgroundColor: "#007AFF",
      flexWrap: "wrap",
    },
    tableTitle: {
      flexGrow: 1,
      flexWrap: "wrap",
    },
    tableHeaderText: {
      color: "yellow",
      fontWeight: "bold",
      fontSize: 14,
    },
    tableCellText: {
      color: "white",
    },
  });
