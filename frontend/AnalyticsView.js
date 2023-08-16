import { StatusBar } from "expo-status-bar";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";

import TableExample from "./table";
import ProgressTracker from "./ProgressTracker";
import { useTheme, ProgressBar, MD3Colors } from "react-native-paper";

const hostIp = "10.0.0.140";
const port = "5000";

const fetchData = async (id, user) => {
  let eventDates = [];
  let mastery = [];

  try {
    const axiosUserId = await axios.get(
      `http://${hostIp}:${port}/api/v1/users-email/${user.email}`
    );
    const userId = axiosUserId.data.user_id;
    const response2 = await axios.get(
      `http://${hostIp}:${port}/api/v1/students/${userId}/mastery-logs`
    );

    response2.data.forEach((item) => {
      if (item.skill_id === id) {
        const date = item.date_of_event;
        const formattedDate = date
          .replace(/^(\d{4})-/, "")
          .replace(/-/g, "/")
          .replace(/0/g, "");
        eventDates.push(formattedDate);
        mastery.push(item.mastery_status);
      }
    });

    return { eventDates, mastery };
  } catch (error) {
    console.log(
      "An error occured with axios: " + error.response.data,
      error.response.status,
      error.response.headers
    );
    return { eventDates, mastery };
  }
};

const ExampleGraph = ({ primaryColor, data1, data2 }) => {
  const chartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    decimalPlaces: 1,
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

  function* yLabel() {
    yield* [5, "", 0];
  }

  return (
    <LineChart
      data={{
        labels: data1,
        datasets: [
          {
            data: data2,
          },
          { data: [0], withDots: false, withShadow: false },
          { data: [5], withDots: false, withShadow: false },
        ],
      }}
      width={Dimensions.get("window").width}
      height={220}
      yAxisInterval={1}
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
  const { user } = useContext(AuthContext);

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
      paddingTop: Platform.OS === "web" ? 100 : 0, // Apply padding only for web
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
  // set states for Homework, Reading, Writing, Notetaking, and Mindset skills and their respective eventDates and mastery
  const [HomeworkDates, setHomeworkDates] = useState([]);
  const [HomeworkMastery, setHomeworkMastery] = useState([]);
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const { eventDates, mastery } = await fetchData(1, user);
      setHomeworkDates(eventDates);
      setHomeworkMastery(mastery);
    };

    fetchDataAndSetState();
  }, []);

  const [readingDates, setReadingDates] = useState([]);
  const [readingMastery, setReadingMastery] = useState([]);
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const { eventDates, mastery } = await fetchData(2, user);
      setReadingDates(eventDates);
      setReadingMastery(mastery);
    };

    fetchDataAndSetState();
  }, []);

  const [writingDates, setWritingDates] = useState([]);
  const [writingMastery, setWritingMastery] = useState([]);

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const { eventDates, mastery } = await fetchData(3, user);
      setWritingDates(eventDates);
      setWritingMastery(mastery);
    };

    fetchDataAndSetState();
  }, []);

  const [notetakingDates, setNotetakingDates] = useState([]);
  const [notetakingMastery, setNotetakingMastery] = useState([]);

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const { eventDates, mastery } = await fetchData(4, user);
      setNotetakingDates(eventDates);
      setNotetakingMastery(mastery);
    };

    fetchDataAndSetState();
  }, []);

  const [mindsetDates, setMindsetDates] = useState([]);
  const [mindsetMastery, setMindsetMastery] = useState([]);
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const { eventDates, mastery } = await fetchData(5, user);
      setMindsetDates(eventDates);
      setMindsetMastery(mastery);
    };
    fetchDataAndSetState();
  }, []);

  return (
    // render all graphs and tables in a scrollable view that is contained in a safe area view that is contained in a view
    <View style={styles.container}>
      {/* add padding to safearea view on web only */}
      <SafeAreaView style={{ paddingTop: Platform.OS === "web" ? 100 : 0 }}>
        <ScrollView>
          <View style={[styles.container, styles.graphContainer]}>
            <Text style={styles.graphText}>Homework</Text>
            <ExampleGraph
              primaryColor={colors.primary}
              data1={HomeworkDates}
              data2={HomeworkMastery}
            />
          </View>
          <View style={[styles.container, styles.graphContainer]}>
            <Text style={styles.graphText}>Reading</Text>
            <ExampleGraph
              primaryColor={colors.primary}
              data1={readingDates}
              data2={readingMastery}
            />
          </View>
          <View style={[styles.container, styles.graphContainer]}>
            <Text style={styles.graphText}>Writing</Text>
            <ExampleGraph
              primaryColor={colors.primary}
              data1={writingDates}
              data2={writingMastery}
            />
          </View>
          <View style={[styles.container, styles.graphContainer]}>
            <Text style={styles.graphText}>Notetaking</Text>
            <ExampleGraph
              primaryColor={colors.primary}
              data1={notetakingDates}
              data2={notetakingMastery}
            />
          </View>
          <View style={[styles.container, styles.graphContainer]}>
            <Text style={styles.graphText}>Mindset</Text>
            <ExampleGraph
              primaryColor={colors.primary}
              data1={mindsetDates}
              data2={mindsetMastery}
            />
          </View>
          <TableExample />
          <ProgressTracker />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AnalyticsView;
