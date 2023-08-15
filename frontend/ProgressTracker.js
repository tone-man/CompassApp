import React, { useEffect, useState, useContext } from "react";
import { StyleSheet } from "react-native";
import axios from "axios";
import { DataTable, Text, useTheme, ProgressBar } from "react-native-paper";
import { View } from "react-native";
import { AuthContext } from "./AuthContext";

// fetch data from backend
const fetchData = async (user) => {
  try {
    const axiosUserId = await axios.get(
      "http://10.0.0.140:5000/api/v1/users-email/" + user.email
    );
    const userId = axiosUserId.data.user_id;
    const response2 = await axios.get(
      "http://10.0.0.140:5000/api/v1/students/" + userId
    );

    console.log("Data:" + response2.data.study_time_completed);
    const study_time_completed = response2.data.study_time_completed;
    const study_time_required = response2.data.study_time_required;
    const base_time_required = response2.data.base_time_required;

    return {
      study_time_completed: study_time_completed,
      study_time_required: study_time_required,
      base_study_time: base_time_required,
    };
  } catch (error) {
    console.error(error);
    return {
      study_time_completed: null,
      study_time_required: null,
      base_study_time: null,
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
  const { user } = useContext(AuthContext);

  const stylesConfig = styles(colors);
  // fetch data from backend and set states
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const { study_time_completed, study_time_required, base_study_time } =
        await fetchData(user);
      setCompleted(study_time_completed);
      setRequired(study_time_required);
      setBase(base_study_time);
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
