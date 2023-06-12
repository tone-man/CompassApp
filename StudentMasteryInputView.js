import { View, Text, StyleSheet } from "react-native";

import { TextInput, Button } from "react-native-paper";

export default function StudentMasteryInputView() {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>ADD A MASTERY SKILL</Text>

      <TextInput label="Skill" style={styles.text_input} />

      <TextInput label="Date" style={styles.text_input} />

      <Button mode="contained" style={styles.button}>
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    margin: "5%",
  },

  titleText: {
    marginBottom: "5%",
  },

  text_input: {
    width: "100%",
    marginBottom: "5%",
  },

  button: {
    width: "90%",
  },
});
