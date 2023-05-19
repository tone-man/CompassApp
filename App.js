import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Image, View, SafeAreaView, Dimensions } from 'react-native';
import TableExample from './table';
export default function App() {
  const dimwidth = Dimensions.get('window').width;
  const dimheight = Dimensions.get('window').height;
  return (
    <View style={styles.container}>
      <Image
        source={require('C:/Users/micha/OneDrive/Documents/Compass App/CompassApp/QR_Code.png')}
        style={{ resizeMode: 'center', paddingTop: 0, width: dimwidth/5, height:dimheight/5}}
      />
      <SafeAreaView>
      <TableExample />
   </SafeAreaView>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
});
