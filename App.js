import React from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  Appbar,
  DefaultTheme,
  Provider as PaperProvider,
  BottomNavigation,
} from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";

export default function App() {
  const [index, setIndex] = React.useState(0);

  const NavigationBar = () => (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );

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

  const AnalyticsRoute = () => (
    <View style={styles.routeContainer}>
      <Text>Analytics Screen</Text>
      {/* Add your analytics screen content here */}
    </View>
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
    { key: "analytics", title: "Analytics", icon: "chart-bar" },
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
          <View style={styles.content}>{/* Your app content */}</View>
          <NavigationBar />
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
    flex: 1,
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
