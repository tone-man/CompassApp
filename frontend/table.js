import React, { useEffect, useState, useContext } from "react";
import { StyleSheet } from "react-native";
import { DataTable, Text, useTheme } from "react-native-paper";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { ip, hostPort } from "./globals.js";
import { DataContext } from "./DataContext";

const hostIp = ip;
const port = hostPort;

const fetchData = async (id, user) => {
  // fetch data from backend and set states for eventDates and mastery for each skill (this is the similiar to the fetchData function in AnalyticsView.js)
  try {
    const axiosUserId = await axios.get(
      "http://" + hostIp + ":" + port + "/api/v1/users-email/" + user.email
    );
    const userId = axiosUserId.data.user_id;

    const response2 = await axios.get(
      "http://" +
        hostIp +
        ":" +
        port +
        "/api/v1/students/" +
        userId +
        "/behavior-logs"
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

const TableExample = () => {
  // set up states for eventDates and mastery for each skill
  const [missedClass, setMissedClass] = useState(0);
  const [missedCoachingMeeting, setMissedCoachingMeeting] = useState(0);
  const [missedAssignments, setMissedAssignments] = useState(0);
  const [lateAssignments, setLateAssignments] = useState(0);
  const { user } = useContext(AuthContext); // get signOut from context
  const { refreshData, setRefreshData } = useContext(DataContext);

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const {
        missedClass: fetchedMissedClass,
        missedCoachingMeeting: fetchedMissedCoachingMeeting,
        missedAssignments: fetchedMissedAssignments,
        lateAssignments: fetchedLateAssignments,
      } = await fetchData(1, user);

      setMissedClass(fetchedMissedClass || 0);
      setMissedCoachingMeeting(fetchedMissedCoachingMeeting || 0);
      setMissedAssignments(fetchedMissedAssignments || 0);
      setLateAssignments(fetchedLateAssignments || 0);

      // Reset the refreshData flag after fetching
      setRefreshData(false);
    };

    fetchDataAndSetState();
  }, [refreshData, user]); // Note: `refreshData` and `user` are added to the dependency array

  const { colors } = useTheme();
  const stylesConfig = styles(colors);

  return (
    // set up a table that contains the behaviors and the number of times they have occurred
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
          <Text style={stylesConfig.tableCellText}>{missedAssignments}</Text>
        </DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell>
          <Text style={stylesConfig.tableCellText}>Late Assignments</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={stylesConfig.tableCellText}>{lateAssignments}</Text>
        </DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell>
          <Text style={stylesConfig.tableCellText}>Missing Assignments</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={stylesConfig.tableCellText}>
            {missedAssignments - lateAssignments}
          </Text>
        </DataTable.Cell>
      </DataTable.Row>
    </DataTable>
  );
};

export default TableExample;
// set up styles for the container, title text, text inputs, and button
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
