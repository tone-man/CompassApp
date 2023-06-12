import { StatusBar } from "expo-status-bar";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";

import TableExample from "./table";
import { useTheme } from "react-native-paper";

const fetchData = async () => {
  try {
    const response = await axios.get(
      "http://192.168.4.63:5000/api/users/john.doe@example.com"
    );

    const userId = response.data.user_id;
    const response2 = await axios.get(
      "http://192.168.4.63:5000/api/skill_mastery/" + userId + "/"
    );

    console.log(response2);
    console.log("");
  } catch (error) {
    console.error(error);
  }
};
fetchData();
const ExampleGraph = ({ primaryColor }) => {
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
      stroke: primaryColor,
    },
  };

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

const AnalyticsView = () => {
  const { colors } = useTheme();

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
      backgroundColor: colors.primary,
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

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <View style={[styles.container, styles.graphContainer]}>
            <Text style={styles.graphText}>Reading</Text>
            <ExampleGraph primaryColor={colors.primary} />
          </View>
          <View style={[styles.container, styles.graphContainer]}>
            <Text style={styles.graphText}>Writing</Text>
            <ExampleGraph primaryColor={colors.primary} />
          </View>
          <View style={[styles.container, styles.graphContainer]}>
            <Text style={styles.graphText}>Note-taking</Text>
            <ExampleGraph primaryColor={colors.primary} />
          </View>
          <View style={[styles.container, styles.graphContainer]}>
            <Text style={styles.graphText}>Mindset</Text>
            <ExampleGraph primaryColor={colors.primary} />
          </View>

          <TableExample />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default AnalyticsView;
