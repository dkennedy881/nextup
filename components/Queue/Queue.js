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
  const getOpen = () => {
    switch (new Date().getDay()) {
      case 1:
        if (queue.monday.active) {
          return queue.monday.open + " - ";
        } else {
          return "Closed";
        }
      case 2:
        if (queue.tuesday.active) {
          return queue.tuesday.open + " - ";
        } else {
          return "Closed";
        }
      case 3:
        if (queue.wednesday.active) {
          return queue.wednesday.open + " - ";
        } else {
          return "Closed";
        }
      case 4:
        if (queue.thursday.active) {
          return queue.thursday.open + " - ";
        } else {
          return "Closed";
        }
      case 5:
        if (queue.friday.active) {
          return queue.friday.open + " - ";
        } else {
          return "Closed";
        }
      case 6:
        if (queue.saturday.active) {
          return queue.saturday.open + " - ";
        } else {
          return "Closed";
        }
      default:
        if (queue.sunday.active) {
          return queue.sunday.open + " - ";
        } else {
          return "";
        }
    }
  };
  const getClose = () => {
    switch (new Date().getDay()) {
      case 1:
        if (queue.monday.active) {
          return queue.monday.close;
        } else {
          return "";
        }
      case 2:
        if (queue.tuesday.active) {
          return queue.tuesday.close;
        } else {
          return "";
        }
      case 3:
        if (queue.wednesday.active) {
          return queue.wednesday.close;
        } else {
          return "";
        }
      case 4:
        if (queue.thursday.active) {
          return queue.thursday.close;
        } else {
          return "";
        }
      case 5:
        if (queue.friday.active) {
          return queue.friday.close;
        } else {
          return "";
        }
      case 6:
        if (queue.saturday.active) {
          return queue.saturday.close;
        } else {
          return "";
        }
      default:
        if (queue.sunday.active) {
          return queue.sunday.close;
        } else {
          return "";
        }
    }
  };
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
            <Text style={styles.hoursText}>{getOpen()}</Text>
            <Text style={styles.hoursText}>{getClose()}</Text>
          </View>
        </View>
        <View style={styles.queueCountContainer}>
          <Text style={styles.queueCountText}>{queue.count}</Text>
          <Text style={styles.queueCountTextSub}>{"in line"}</Text>
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
    backgroundColor: "white",
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
    color: "salmon",
    fontWeight: "900",
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
    minWidth: 70,
    minHeight: 70,
    backgroundColor: "#8ecfd4",
  },
  queueCountText: {
    fontSize: 30,
    padding: 10,
    paddingBottom: 0,
    textAlign: "center",
    color: "white",
    fontWeight: "900",
  },
  queueCountTextSub: {
    fontSize: 12,
    textAlign: "center",
    color: "yellow",
    // color: "#fefefe",
    fontWeight: "500",
  },
});

export default Queue;
