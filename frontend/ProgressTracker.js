import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import axios from "axios";
import { DataTable, Text, useTheme, ProgressBar } from "react-native-paper";
import { View } from "react-native";

// fetch data from backend
const fetchData = async () => {
  try {
    const response = await axios.get(
      "http://192.168.4.63:5000/api/users/john.doe@example.com" // need to change email address to whoever is logged in rather than john.doe@example.com
    );

    const userId = response.data.user_id;
    const response2 = await axios.get(
      "http://192.168.4.63:5000/api/students/" + userId + "/"
    );

    const study_minutes_completed = response2.data.study_time_completed;
    const study_minutes_required = response2.data.study_time_required;
    const base_study_minutes = response2.data.base_time_required;
    console.log(
      study_minutes_completed,
      study_minutes_required,
      base_study_minutes
    );

    return {
      study_minutes_completed,
      study_minutes_required,
      base_study_minutes,
    };
  } catch (error) {
    console.error(error);
    return {
      study_minutes_completed: null,
      study_minutes_required: null,
      base_study_minutes: null,
    };
  }
};
// format time to hours and minutes for display in table
const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hours ${remainingMinutes} minutes`;
};

const ProgressTracker = () => {
  const { colors } = useTheme();
  // set states for completed, required, base, and progress
  const [completed, setCompleted] = useState(0);
  const [required, setRequired] = useState(0);
  const [base, setBase] = useState(0);
  const [progress, setProgress] = useState(0);

  const stylesConfig = styles(colors);
  // fetch data from backend and set states
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const {
        study_minutes_completed,
        study_minutes_required,
        base_study_minutes,
      } = await fetchData();
      setCompleted(study_minutes_completed);
      setRequired(study_minutes_required);
      setBase(base_study_minutes);
    };

    fetchDataAndSetState();
  }, []);

  // calculate progress
  useEffect(() => {
    const validProgress =
      !isNaN(completed) && !isNaN(required) && required !== 0
        ? Math.min(1, completed / required)
        : 0;
    setProgress(validProgress);
  }, [completed, required]);

  return (
    // display progress bar and table
    <View style={styles.container}>
      <DataTable style={stylesConfig.graph}>
        <DataTable.Header>
          <DataTable.Title>
            <Text style={stylesConfig.tableHeaderText}>Study Time</Text>
          </DataTable.Title>
        </DataTable.Header>
        <ProgressBar progress={progress} color={"yellow"} />

        <DataTable.Row>
          <DataTable.Cell>
            <Text style={stylesConfig.tableCellText}>Complete</Text>
          </DataTable.Cell>
          <DataTable.Cell numeric>
            <Text style={stylesConfig.tableCellText}>
              {formatTime(completed)}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>
            <Text style={stylesConfig.tableCellText}>Remaining</Text>
          </DataTable.Cell>
          <DataTable.Cell numeric>
            <Text style={stylesConfig.tableCellText}>
              {required - completed <= 0
                ? "0 hours 0 minutes"
                : formatTime(required - completed)}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>
            <Text style={stylesConfig.tableCellText}>Required</Text>
          </DataTable.Cell>
          <DataTable.Cell numeric>
            <Text style={stylesConfig.tableCellText}>
              {formatTime(required)}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </View>
  );
};
// export ProgressTracker
export default ProgressTracker;
// styles for ProgressTracker
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
