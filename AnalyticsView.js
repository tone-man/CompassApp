
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
    stroke: "#ffa726",
  },
};

const AnalyticsView = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <View style={[styles.container, styles.graph]}>
            <Text>Reading</Text>
            <ExampleGraph />
          </View>
          <View style={[styles.container, styles.graph]}>
            <Text>Writing</Text>
            <ExampleGraph />
          </View>
          <View style={[styles.container, styles.graph]}>
            <Text>Note-taking</Text>
            <ExampleGraph />
          </View>
          <View style={[styles.container, styles.graph]}>
            <Text>Mindset</Text>
            <ExampleGraph />
          </View>
          <View style={[styles.container, styles.graph]}>
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
    alignItems: "center",
    justifyContent: "center"
  },
  graphContainer: {
    height: 470,
    marginVertical: "2.5%",
    marginBottom: "2.5%",
    borderRadius: 20,
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
