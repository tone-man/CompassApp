import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";

import {
  Appbar,
  DefaultTheme,
  Provider as PaperProvider,
  BottomNavigation,
  TextInput,
  Button,
} from "react-native-paper";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import Icon from "react-native-vector-icons/FontAwesome";

import AnalyticsView from "./AnalyticsView";
import QRScannerView from "./QRScannerView";
import StudentMasteryInputView from "./StudentMasteryInputView";

export default function App() {
  const [index, setIndex] = React.useState(0);

  const HeaderContent = () => (
    <View style={styles.headerContent}>
      <View style={styles.iconButtonContainer}>
        <Icon name="user" size={24} color="black" />
      </View>
      <Appbar.Content
        title={<Icon name="compass" size={24} color="black" />}
        titleStyle={{ marginLeft: 0 }}
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

  const AnalyticsRoute = () => <AnalyticsView />;

  const QrCodeRoute = () => <QRScannerView />;

  const UserInputRoute = () => <StudentMasteryInputView />;

  const routes = [
    { key: "analytics", title: "Analytics", icon: "line-chart" },
    { key: "qrCode", title: "QR Code", icon: "qrcode" },
    { key: "addContent", title: "Add Content", icon: "plus-circle" },
  ];

  const renderScene = BottomNavigation.SceneMap({
    analytics: AnalyticsRoute,
    qrCode: QrCodeRoute,
    addContent: UserInputRoute,
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
