import React from "react";
import { StyleSheet, View, Text, Dimensions, ScrollView } from "react-native";

import {
  Appbar,
  DefaultTheme,
  Provider as PaperProvider,
  BottomNavigation,
} from "react-native-paper";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

import Icon from "react-native-vector-icons/FontAwesome";

export default function App() {
  const [index, setIndex] = React.useState(0);

  const HeaderContent = () => (
    <View style={styles.headerContent}>
      <View style={styles.iconButtonContainer}>
        <Icon name="user" size={24} color="black" />
      </View>
      <Appbar.Content
        title={<Icon name="compass" size={24} color="black" />}
        titleStyle={{ marginLeft: 10 }}
        style={styles.headerTitle}
      />
    </View>
  );

  const BottomNavigationBar = () => (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderIcon={({ route, color }) => (
        <Icon name={route.icon} size={24} color={color} />
      )}
    />
  );

  const AnalyticsRoute = () => (
    <ScrollView>
      <Text>Bezier Line Chart</Text>
      <LineChart
        data={{
          labels: [1, 2, 3, 4, 5, 6],
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
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
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
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </ScrollView>
  );

  const QrCodeRoute = () => (
    <View style={styles.routeContainer}>
      <Text>QR Code Screen</Text>
      {/* Add your QR code screen content here */}
    </View>
  );

  const AddContentRoute = () => (
    <View style={styles.routeContainer}>
      <Text>Add Content Screen</Text>
      {/* Add your add content screen content here */}
    </View>
  );

  const routes = [
    { key: "analytics", title: "Analytics", icon: "line-chart" },
    { key: "qrCode", title: "QR Code", icon: "qrcode" },
    { key: "addContent", title: "Add Content", icon: "plus-circle" },
  ];

  const renderScene = BottomNavigation.SceneMap({
    analytics: AnalyticsRoute,
    qrCode: QrCodeRoute,
    addContent: AddContentRoute,
  });

  return (
    <SafeAreaProvider>
      <PaperProvider theme={DefaultTheme}>
        <View style={styles.container}>
          <Appbar.Header>
            <HeaderContent />
          </Appbar.Header>
          <BottomNavigationBar />
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
  },
  iconButtonContainer: {
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
    alignItems: "center",
  },
  routeContainer: {
    flex: 1,
    alignItems: "center",
  },
});
