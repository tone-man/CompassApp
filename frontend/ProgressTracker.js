import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import axios from "axios";
import {
  DataTable,
  Text,
  useTheme,
  ProgressBar,
  MD3Colors,
} from "react-native-paper";
import { View } from "react-native";
const fetchData = async (id) => {
  try {
    const response = await axios.get(
      "http://192.168.4.63:5000/api/users/john.doe@example.com"
    );

    const userId = response.data.user_id;
    const response2 = await axios.get(
      "http://192.168.4.63:5000/api/students/" + userId + "/"
    );

    const study_hours_completed = response2.data.study_hours_completed;
    const study_hours_required = response2.data.study_hours_required;
    const base_study_hours = response2.data.base_study_hours;

    return { study_hours_completed, study_hours_required, base_study_hours };
  } catch (error) {
    console.error(error);
    return { study_hours_completed, study_hours_required, base_study_hours };
  }
};
const ProgressTracker = () => {
  const { colors } = useTheme();

  const [completed, setCompleted] = useState(0);
  const [required, setRequired] = useState(0);

  const [base, setBase] = useState();
  const stylesConfig = styles(colors);
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const { study_hours_completed, study_hours_required, base_study_hours } =
        await fetchData();
      setCompleted(study_hours_completed);
      setRequired(study_hours_required);
      setBase(base_study_hours);
    };

    fetchDataAndSetState();
    console.log("study_hours_completed", completed);
    console.log("study_hours_required", required);
    console.log("base_study_hours", base);
  }, []);
  return (
    <DataTable style={styles.container}>
      <ProgressBar
        progress={required === 0 ? 0 : completed / required}
        color={colors.primary}
      />
      <DataTable style={stylesConfig.graph}>
        <DataTable.Header>
          <DataTable.Title>
            <Text style={stylesConfig.tableHeaderText}>Behaviors</Text>
          </DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>
            <Text style={stylesConfig.tableCellText}>Study Hours Done</Text>
          </DataTable.Cell>
          <DataTable.Cell numeric>
            <Text style={stylesConfig.tableCellText}>{completed}</Text>
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>
            <Text style={stylesConfig.tableCellText}>Study Hours Goal</Text>
          </DataTable.Cell>
          <DataTable.Cell numeric>
            <Text style={stylesConfig.tableCellText}>{required}</Text>
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>
            <Text style={stylesConfig.tableCellText}>Study Hours Base</Text>
          </DataTable.Cell>
          <DataTable.Cell numeric>
            <Text style={stylesConfig.tableCellText}>{base}</Text>
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </DataTable>
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
