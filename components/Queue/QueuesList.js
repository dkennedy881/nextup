import React, { useState, Component } from "react";
import Axios from "axios";

//comps
import Queue from "./Queue";

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  FlatList,
  ListItem,
  ImageBackground,
  RefreshControl,
} from "react-native";

class QueuesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queues: [],
      isSet: false,
      isRefreshing: false,
    };
  }

  onRefresh = async () => {
    await this.setState({ isRefreshing: true });
    let queues = [];
    try {
      queues = await this.getQueues();
    } catch (e) {
      alert(e);
    }
    setTimeout(() => {
      this.setState((state) => ({
        ...state,
        queues,
        isSet: !state.isSet,
        isRefreshing: false,
      }));
    }, 500);
  };

  getQueues = () => {
    return new Promise(async (res, rej) => {
      try {
        let { data: queueDataA } = await Axios.post(
          "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/nextup-ssnrm/service/getQueues/incoming_webhook/webhook0"
        );
        queueDataA = await queueDataA.reduce((queues, queueData) => {
          let newJSON = {
            title: queueData.title,
            message: queueData.message,
            hours: {
              open: queueData.open,
              close: queueData.close,
            },
            active: queueData.active,
            count: queueData.count["$numberLong"],
            id: queueData.id["$numberLong"],
            address: queueData.address,
            zipCode: queueData.zipCode,
          };
          queues.push(newJSON);
          return queues;
        }, []);
        res(queueDataA);
      } catch (e) {
        alert(e);
      }
    });
  };

  async componentDidMount() {
    if (!this.state.isSet) {
      try {
        let queues = await this.getQueues();
        this.setState((state) => ({
          ...state,
          queues,
          isSet: !state.isSet,
        }));
      } catch (e) {
        alert(e);
      }
    }
  }

  render() {
    let { queues, isRefreshing } = this.state;
    let { onRefresh } = this;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.QueuesListContainer}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <FlatList
            data={queues}
            renderItem={({ item }) => <Queue key={item.id} queue={item} />}
            keyExtractor={(item) => String(item.id)}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

// https://reactnative.dev/docs/refreshcontrol
export default QueuesList;

const styles = StyleSheet.create({
  QueuesListContainer: {
    borderColor: "#eeee",
    borderStyle: "solid",
    // overflow: 'scroll',
    position: "relative",
    top: 1,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
  },
});
