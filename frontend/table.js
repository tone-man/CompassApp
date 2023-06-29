import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { DataTable, Text, useTheme } from "react-native-paper";
import axios from "axios";

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
    const incompleteAssignments = response2.data.reduce((count, behavior) => {
      if (behavior.behavior_id === 3) {
        return count + 1;
      }
      return count;
    }, 0);

    return {
      missedClass,
      missedCoachingMeeting,
      incompleteAssignments,
    };
  } catch (error) {
    console.error(error);
    return {
      missedClass: null,
      missedCoachingMeeting: null,
      incompleteAssignments: null,
    };
  }
};

const TableExample = () => {
  const [missedClass, setMissedClass] = useState(0);
  const [missedCoachingMeeting, setMissedCoachingMeeting] = useState(0);
  const [incompleteAssignments, setIncompleteAssignments] = useState(0);

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const {
        missedClass: fetchedMissedClass,
        missedCoachingMeeting: fetchedMissedCoachingMeeting,
        incompleteAssignments: fetchedIncompleteAssignments,
      } = await fetchData(1);

      setMissedClass(fetchedMissedClass || 0);
      setMissedCoachingMeeting(fetchedMissedCoachingMeeting || 0);
      setIncompleteAssignments(fetchedIncompleteAssignments || 0);
    };

    fetchDataAndSetState();
  }, []);

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
          <Text style={stylesConfig.tableCellText}>{missedClass}</Text>
        </DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell>
          <Text style={stylesConfig.tableCellText}>
            Missed Coaching Meetings
          </Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={stylesConfig.tableCellText}>
            {missedCoachingMeeting}
          </Text>
        </DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell>
          <Text style={stylesConfig.tableCellText}>Missed Assignments</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={stylesConfig.tableCellText}>
            {incompleteAssignments}
          </Text>
        </DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell>
          <Text style={stylesConfig.tableCellText}>Missing Assignments</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={stylesConfig.tableCellText}>{0}</Text>
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
