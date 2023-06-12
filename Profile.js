import React from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";

const Profile = () => {
  const size = 75;
  return (
    <>
      <View>
        <View
          style={{
            alignSelf: "center",
          }}
        >
          <Image
            justifyContent="center"
            source={{
              uri: "https://lh3.googleusercontent.com/fife/APg5EOabC_sGuO_tFjHXe1I13C0vZG-3I91b5idaugxHojdqFsFSBiE75u0jkNfjmIXjGWIsaCk3JPooeUV1qW8Q1NF_jRWJqjRwE30CdEBrkqe-ndlAkxwlbT_x6ioYKgRwQMfR-j_wbdoWlZrho2vQyyw2yLbAuqXVhjiCstFCVP74KlHx9Wnu1hbc0AkcxYI35UiqXbjm67Og0VuxWVqtHam90xHeaYQ7LPDOVYLB4EXlHiGbAeHDekAvn9UPO3Ru1zvDvQwsIXE2nVx9rg4uzdVoaTkKP2OadDZ26QjmsDCnQwODDRy4Q3FodIMdquPk6WaufmMu--o07G9P4HnfU6p-9mss1dz0_FJshlOciarhMXa8BBImh1tB3tWz64daqA_JdgTcMCVzRlAq37YKYt7m1SA84yUc_M5bpKdV2nIpTK-J1QXQGXTEAo73E6I0wfct1mnAxhAu50cAD7l6pfc4177dWze-GRaQDoh3KIIgX0NLtBhVgYAwmT2EgmAFb5OqafN8D5dED0AbLv4GQ7hm1_HT2QXluzadpaT3UK04YJm0aeQoS96v5fhnreQHp6HsVx3XikySVAR-nqZ4oGAoWEtIvmUmcCygiWp9n4kar2WyQiYMyKyJxhRjH3_Px38BSuq5rjIP8tqpuNeizbSuHDogFVyrhR1ebvZ4OvazZXMLUkQi0RpnFbZo5q0WAPuGUccFQRu7vgDlYayvNDMVRR-miLeHyh7N0nRxyS4wYAzRhkUo6NKc9-bIJuepVTQ2dLmKPi63jh2NJiLza_mZyCHDq4z_75tCQ9fX45Gy7wk3s55MqOL6Vbm8Gc1yYympRXu03iXlsIGjAqqJ5QAToVtpO8rtpt59geONlh8Rfz6Wz8pzA5TkGNynfFuxBrzs7WeCI3kLtND8l2XLXswAtpnFvbxCNAsapVgCTXROj799lhFJMRBBlYC_RFfeS-o8zRp38TAWkqkGJZYWSE7PmHMz1ULZLRl1SvGQrioQf2Fw1x3jGaIMNdvfdcrYez_MMv6TlQaoEdltbGJ8HVxtn1ZK0ZtdhopdhOGCbcqRpogzZIiPvx6PPd7_w8LuxRE5J-PF7rb1Fcgp7pJAywnDRBD5iVpop7eDtL7QpaTqTi9jDV_vDjT6HTYT_Nc8ttbzony7NrGMyhSmAKSHAc32rADEQTAHdKamRRvuVxMob0Yw8WL_HToYMta23_gJEH8VuYNyirlVgoCjErUj3OE2W34bOaHrsnw6u3DuAaXMla6iEdQtb7Le7C8VwUXrlNgBJ2aXgi__9xmzBbTQ_k1uoGZ3aKE5yHusPSaqfdi3a4psyTQncnPJnj61dAcWePfx19YB3h0xV4v6MWx7lONs=s32-c",
            }}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
            }}
          />
          <Text>John Doe</Text>
        </View>
        <DataTable style={styles.graph} theme>
          <DataTable.Row>
            <DataTable.Cell>email</DataTable.Cell>
            <DataTable.Cell Text>DoeJ@merrimack.edu</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Major</DataTable.Cell>
            <DataTable.Cell>Communication</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Graduation year</DataTable.Cell>
            <DataTable.Cell numeric>0000</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Student ID</DataTable.Cell>
            <DataTable.Cell numeric>000000</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>

      <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 20 }}>
        <View style={{ backgroundColor: "#1300FF", borderRadius: 10 }}>
          <Button
            title="LOG OUT"
            color="#ECFF00"
            onPress={() => console.log("Button with adjusted color pressed")}
          />
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  graph: {
    marginVertical: "2.5%",
    marginBottom: "2.5%",
    borderRadius: 20,
    backgroundColor: "#ffffff",
  },
});

export default Profile;
