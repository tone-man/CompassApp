import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import axios from "axios";
import { DataTable, Text, useTheme, ProgressBar } from "react-native-paper";
import { View } from "react-native";

const fetchData = async () => {
  try {
    const response = await axios.get(
      "http://192.168.4.63:5000/api/users/john.doe@example.com"
    );

    const userId = response.data.user_id;
    const response2 = await axios.get(
      "http://192.168.4.63:5000/api/students/" + userId + "/"
    );

    const study_minutes_completed = response2.data.study_minutes_completed;
    const study_minutes_required = response2.data.study_minutes_required;
    const base_study_minutes = response2.data.base_study_minutes;

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

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hours ${remainingMinutes} minutes`;
};

const ProgressTracker = () => {
  const { colors } = useTheme();

  const [completed, setCompleted] = useState(0);
  const [required, setRequired] = useState(0);
  const [base, setBase] = useState(0);
  const [progress, setProgress] = useState(0);

  const stylesConfig = styles(colors);

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

  useEffect(() => {
    const validProgress =
      !isNaN(completed) && !isNaN(required) && required !== 0
        ? Math.min(1, completed / required)
        : 0;
    setProgress(validProgress);
  }, [completed, required]);

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} color={colors.primary} />
      <DataTable style={stylesConfig.graph}>
        <DataTable.Header>
          <DataTable.Title>
            <Text style={stylesConfig.tableHeaderText}>Study Time</Text>
          </DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>
            <Text style={stylesConfig.tableCellText}>Study Time Done</Text>
          </DataTable.Cell>
          <DataTable.Cell numeric>
            <Text style={stylesConfig.tableCellText}>
              {formatTime(completed)}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>
            <Text style={stylesConfig.tableCellText}>Study Time Goal</Text>
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

export default ProgressTracker;

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
