import { Text, ScrollView, Dimensions, StyleSheet, View } from "react-native";

import { LineChart, ProgressChart } from "react-native-chart-kit";
import { DataTable } from "react-native-paper";

export default function AnalyticsView() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>ANALYTICS VIEW</Text>

      <View style={[styles.container, styles.graph]}>
        <Text>READING</Text>
        <LineChart
          data={{
            labels: ["9/1", "9/8", "9/15", "9/22", "9/29", "10/5"],
            datasets: [
              {
                data: [
                  Math.round(Math.random() * 22),
                  Math.round(Math.random() * 22),
                  Math.round(Math.random() * 22),
                  Math.round(Math.random() * 22),
                  Math.round(Math.random() * 22),
                  Math.round(Math.random() * 22),
                ],
              },
            ],
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={chartConfig}
          style={styles.graph}
          bezier
        />
      </View>
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

      <View style={styles.graph}>
        <ProgressChart
          data={{
            labels: ["Study Hours"], // optional
            data: [0.1],
          }}
          width={Dimensions.get("window").width}
          height={220}
          strokeWidth={16}
          radius={70}
          chartConfig={chartConfig}
          hideLegend={false}
        />
      </View>
    </ScrollView>
  );
}
const chartConfig = {
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  graph: {
    marginVertical: "2.5%",
    marginBottom: "2.5%",
    borderRadius: 20,
    backgroundColor: "#663399",
  },
});
