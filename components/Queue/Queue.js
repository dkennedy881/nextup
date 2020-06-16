import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

function Queue({ queue, selectQueue }) {
  return (
    <TouchableOpacity
      onPress={() => {
        selectQueue(queue.id);
      }}
    >
      <View style={styles.QueueContainer}>
        <View style={styles.metaDataContainer}>
          <Text style={styles.titleText}>{queue.title}</Text>
          {queue.message ? (
            <Text style={styles.messageText}>{queue.message}</Text>
          ) : null}
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>{queue.address}, </Text>
            <Text style={styles.addressText}>{queue.zipCode}</Text>
          </View>
          <View style={styles.hoursContainer}>
            <Text style={styles.hoursText}>{queue.hours.open} -</Text>
            <Text style={styles.hoursText}>{queue.hours.close}</Text>
          </View>
        </View>
        <View style={styles.queueCountContainer}>
          <Text style={styles.queueCountText}>{queue.count}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  QueueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 15,
    marginRight: 15,
    marginLeft: 15,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderRadius: 9,
  },
  titleText: {
    fontSize: 18,
    color: "black",
    fontWeight: "600",
  },
  messageText: {
    fontSize: 15,
    color: "black",
    fontWeight: "300",
    marginTop: 15,
    marginBottom: 10,
  },
  hoursText: {
    fontSize: 12,
    color: "green",
    fontWeight: "200",
  },
  hoursContainer: {
    display: "flex",
    flexDirection: "row",
  },
  addressContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  addressText: {
    fontSize: 15,
    color: "grey",
    fontWeight: "300",
  },
  metaDataContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginRight: 20,
  },
  queueCountContainer: {
    // borderStyle: "solid",
    // borderColor: "red",
    color: "white",
    // borderWidth: 0.5,
    borderRadius: 5,
    minWidth: 50,
    backgroundColor: "#8ecfd4",
  },
  queueCountText: {
    padding: 10,
    textAlign: "center",
    color: "white",
    fontWeight: "900",
  },
});

export default Queue;
