// https://www.geeksforgeeks.org/how-to-create-material-bottom-tab-navigator-in-react-native/#

import { StatusBar } from "expo-status-bar";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

import {
  StyleSheet,
  Text,
  Image,
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
        labels: ["9/1", "9/2", "9/3", "9/4", "9/5", "9/6"],
        datasets: [
          {
            data: [
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
            ],
          },
        ],
      }}
      width={Dimensions.get("window").width} // from react-native
      height={220}
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={{
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#2F80EA",
        backgroundGradientTo: "#2F80EA",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "#2F80EA",
        },
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  );
};

const AnalyticsView = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <Text>Reading</Text>
            <ExampleGraph />
          </View>
          <View style={styles.container}>
            <Text>Writing</Text>
            <ExampleGraph />
          </View>
          <View style={styles.container}>
            <Text>Note-taking</Text>
            <ExampleGraph />
          </View>
          <View style={styles.container}>
            <Text>Mindset</Text>
            <ExampleGraph />
          </View>
          <View style={styles.container}>
            <TableExample />
          </View>
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
  },
  graphContainer: {
    height: 470,
  },
  graph: {
    paddingRight: 30,
  },
  table: {
    container: {
      flex: 1,
    },
  },
});
