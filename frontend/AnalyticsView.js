import { StatusBar } from "expo-status-bar";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";

import { useTheme } from "react-native-paper";

const fetchData = async (id) => {
  let eventDates = [];
  let mastery = [];
  try {
    const response = await axios.get(
      "http://192.168.4.63:5000/api/users/john.doe@example.com"
    );

    const userId = response.data.user_id;
    const response2 = await axios.get(
      "http://192.168.4.63:5000/api/skill_mastery/" + userId + "/"
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
    console.error(error);
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

  const [readingDates, setReadingDates] = useState([]);
  const [readingMastery, setReadingMastery] = useState([]);
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const { eventDates, mastery } = await fetchData(2);
      setReadingDates(eventDates);
      setReadingMastery(mastery);
    };

    fetchDataAndSetState();
  }, []);

  const [writingDates, setWritingDates] = useState([]);
  const [writingMastery, setWritingMastery] = useState([]);

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const { eventDates, mastery } = await fetchData(3);
      setWritingDates(eventDates);
      setWritingMastery(mastery);
    };

    fetchDataAndSetState();
  }, []);

  const [notetakingDates, setNotetakingDates] = useState([]);
  const [notetakingMastery, setNotetakingMastery] = useState([]);

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const { eventDates, mastery } = await fetchData(4);
      setNotetakingDates(eventDates);
      setNotetakingMastery(mastery);
    };

    fetchDataAndSetState();
  }, []);

  const [mindsetDates, setMindsetDates] = useState([]);
  const [mindsetMastery, setMindsetMastery] = useState([]);
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const { eventDates, mastery } = await fetchData(5);
      setMindsetDates(eventDates);
      setMindsetMastery(mastery);
    };
    fetchDataAndSetState();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
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
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AnalyticsView;
