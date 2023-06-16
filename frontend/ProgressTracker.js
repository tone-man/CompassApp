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
      <DataTable style={styles.graph}>
        <ProgressBar
          progress={required === 0 ? 0 : completed / required}
          color={colors.primary}
        />
        <DataTable.Header>
          <DataTable.Title>Behaviors</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>Study Hours Done</DataTable.Cell>
          <DataTable.Cell numeric>{completed}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Study Hours Goal</DataTable.Cell>
          <DataTable.Cell numeric>{required}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Study Hours Base</DataTable.Cell>
          <DataTable.Cell numeric>{base}</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </DataTable>
  );
};

export default ProgressTracker;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  graph: {
    marginVertical: "2.5%",
    marginBottom: "2.5%",
    borderRadius: 20,
    backgroundColor: "#007AFF",
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
    fontSize: 10,
  },
  tableCellText: {
    color: "black",
  },
});
