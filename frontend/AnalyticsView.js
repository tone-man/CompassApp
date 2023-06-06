import { StatusBar } from "expo-status-bar";
import { LineChart } from "react-native-chart-kit";

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";

import TableExample from "./table";

const ExampleGraph = () => {
  return (
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
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  );
};

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
    stroke: "#007bff",
  },
};

const AnalyticsView = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <View style={[styles.container, styles.graphContainer]}>
            <Text style={styles.graphText}>Reading</Text>
            <ExampleGraph />
          </View>
          <View style={[styles.container, styles.graphContainer]}>
            <Text style={styles.graphText}>Writing</Text>
            <ExampleGraph />
          </View>
          <View style={[styles.container, styles.graphContainer]}>
            <Text style={styles.graphText}>Note-taking</Text>
            <ExampleGraph />
          </View>
          <View style={[styles.container, styles.graphContainer]}>
            <Text style={styles.graphText}>Mindset</Text>
            <ExampleGraph />
          </View>

          <TableExample />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default AnalyticsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  graphContainer: {
    marginVertical: "2.5%",
    marginBottom: "2.5%",
    borderRadius: 20,
    backgroundColor: "#007AFF",
  },
  table: {
    container: {
      flex: 1,
    },
  },
  graphText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
