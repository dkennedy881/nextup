import React, { useState, Component } from "react";
import Axios from "axios";
import { Icon } from "react-native-elements";

//comps
import Queue from "./Queue";
import FilterItem from "./FilterItem";

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
  TouchableOpacity,
} from "react-native";

class QueuesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queues: [],
      isSet: false,
      isRefreshing: false,
      selectedQueue: false,
      states: [],
      selectedState: false,
      cities: false,
      selectedCity: false,
      filteredQueues: false,
    };
  }

  selectState = async (stateName) => {
    let queues = [];
    try {
      queues = await this.getQueues();
    } catch (e) {
      alert(e);
    }
    let cities = queues.reduce((acc, cur) => {
      if (cur.state === stateName) {
        if (!acc.includes(cur.city)) {
          acc.push(cur.city);
        }
      }
      return acc;
    }, []);
    this.setState({
      selectedState: stateName,
      queues,
      cities: cities,
      isRefreshing: false,
    });
  };

  selectCity = async (cityName) => {
    let queues = [];
    try {
      queues = await this.getQueues();
    } catch (e) {
      alert(e);
    }
    let filteredQueues = queues.reduce((acc, cur) => {
      if (this.state.selectedState === cur.state && cityName === cur.city) {
        acc.push(cur);
      }
      return acc;
    }, []);
    this.setState({
      selectedCity: cityName,
      filteredQueues,
      isRefreshing: false,
    });
  };

  selectQueue = (id) => {
    const { queues } = this.state;
    const selected = queues.filter((q) => {
      return q.id === id;
    })[0];
    this.setState({ selectedQueue: selected });
  };

  unSelectState = async () => {
    this.setState({ selectedState: false });
    await this.setState({ isRefreshing: true });
    this.onRefresh();
  };
  unSelectCity = async () => {
    this.setState({ selectedCity: false });
    await this.setState({ isRefreshing: true });
    this.onRefresh();
  };
  unSelectQueue = () => {
    this.setState({ selectedQueue: false });
  };

  onRefresh = async () => {
    await this.setState({ isRefreshing: true });

    if (!this.state.selectedState) {
      let queues = [];
      try {
        queues = await this.getQueues();
      } catch (e) {
        alert(e);
      }
      let states = queues
        .map((q) => {
          return q.state;
        })
        .reduce((acc, cur) => {
          if (!acc.includes(cur)) {
            acc.push(cur);
          }
          return acc;
        }, []);
      setTimeout(() => {
        this.setState((state) => ({
          ...state,
          states,
          isRefreshing: false,
        }));
      }, 500);
      return;
    }
    if (!this.state.selectedCity) {
      setTimeout(() => {
        this.selectState(this.state.selectedState, queues);
      }, 500);
      return;
    }
    let queues = [];
    try {
      queues = await this.getQueues();
    } catch (e) {
      alert(e);
    }
    let filteredQueues = queues.reduce((acc, cur) => {
      if (
        this.state.selectedState === cur.state &&
        this.state.selectedCity === cur.city
      ) {
        acc.push(cur);
      }
      return acc;
    }, []);
    setTimeout(() => {
      this.setState((state) => ({
        ...state,
        queues,
        filteredQueues,
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
            city: queueData.city,
            state: queueData.state,
            maxCount: queueData.maxCount
              ? queueData.maxCount["$numberDouble"]
              : null,
            mask: queueData.mask,
            sani: queueData.sani,
            businessNumber: queueData.businessNumber,
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
        let states = queues
          .map((q) => {
            return q.state;
          })
          .reduce((acc, cur) => {
            if (!acc.includes(cur)) {
              acc.push(cur);
            }
            return acc;
          }, []);

        this.setState((state) => ({
          ...state,
          queues,
          states,
          isSet: !state.isSet,
        }));
      } catch (e) {
        alert(e);
      }
    }
  }

  render() {
    let {
      queues,
      isRefreshing,
      selectedQueue,
      states,
      selectedState,
      cities,
      selectedCity,
      filteredQueues,
    } = this.state;
    let {
      onRefresh,
      selectQueue,
      unSelectQueue,
      selectState,
      unSelectState,
      unSelectCity,
      selectCity,
    } = this;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          display: "flex",
          backgroundColor: `${selectedQueue ? "#919191" : "#fbfbfb"}`,
        }}
      >
        {selectedState ? (
          selectedCity ? (
            <TouchableOpacity
              onPress={() => {
                unSelectCity();
              }}
            >
              <Text
                style={
                  selectedQueue
                    ? styles.metaSectionFilterHide
                    : styles.metaSectionFilter
                }
              >{`Showing queues in ${selectedCity}, ${selectedState}. Press here to remove ${selectedCity} filter`}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                unSelectState();
              }}
            >
              <Text
                style={styles.metaSectionFilter}
              >{`Select a city below or press here to remove ${selectedState} filter`}</Text>
            </TouchableOpacity>
          )
        ) : (
          <Text style={styles.metaSectionFilter}>{"Select a state"}</Text>
        )}
        <ScrollView
          contentContainerStyle={styles.QueuesListContainer}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <View>
            {selectedState ? (
              selectedCity ? (
                <FlatList
                  data={filteredQueues}
                  renderItem={({ item }) => (
                    <Queue
                      selectQueue={selectQueue}
                      unSelectQueue={unSelectQueue}
                      key={item.id}
                      queue={item}
                    />
                  )}
                  keyExtractor={(item) => String(item.id)}
                />
              ) : (
                <FlatList
                  data={cities}
                  renderItem={({ item }) => (
                    <FilterItem
                      selectQueue={selectQueue}
                      unSelectQueue={unSelectCity}
                      key={item}
                      name={item}
                      setHandler={selectCity}
                    />
                  )}
                  keyExtractor={(item) => String(item)}
                />
              )
            ) : (
              <FlatList
                data={states}
                renderItem={({ item }) => (
                  <FilterItem
                    selectQueue={selectQueue}
                    unSelectQueue={unSelectQueue}
                    key={item}
                    name={item}
                    setHandler={selectState}
                  />
                )}
                keyExtractor={(item) => String(item)}
              />
            )}
          </View>
        </ScrollView>
        {selectedQueue ? (
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              position: "absolute",
              top: 20,
              height: "103%",
              zIndex: 1000,
              borderTopRightRadius: 9,
              borderTopLeftRadius: 9,
              borderWidth: 1,
              borderColor: "white",
              paddingBottom: 20,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                borderTopColor: "white",
                borderRightColor: "white",
                borderLeftColor: "white",
                borderBottomColor: "#f1f1f1",
                borderWidth: 1,
                padding: 5,
              }}
            >
              <View style={{ width: 30 }}></View>
              <Text style={styles.titleText}>{selectedQueue.title}</Text>
              <TouchableOpacity
                onPress={() => {
                  unSelectQueue();
                }}
              >
                <Icon
                  style={{
                    marginRight: 5,
                    marginTop: 3,

                    shadowColor: "#eee",
                    shadowOffset: {
                      width: 1,
                      height: 1,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 0.84,

                    elevation: 1,
                    borderRadius: 9,
                  }}
                  name={"times-circle"}
                  type="font-awesome"
                  color="#6da8bd"
                  size={30}
                />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.metaSectionCenter}>
                <View style={styles.metaSectionCenterContent}>
                  <Text style={styles.countText}>{selectedQueue.count}</Text>
                </View>
              </View>
              <View style={styles.metaSection}>
                <Text style={styles.metaSectionTitle}>Masks Required</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.metaSectionData}>
                    {selectedQueue.mask ? "Yes" : "No"}
                  </Text>
                </View>
              </View>
              <View style={styles.metaSection}>
                <Text style={styles.metaSectionTitle}>Sanitizer Available</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.metaSectionData}>
                    {selectedQueue.sani ? "Yes" : "No"}
                  </Text>
                </View>
              </View>
              <View style={styles.metaSection}>
                <Text style={styles.metaSectionTitle}>Max Capacity</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.maxCount}>
                    {selectedQueue.maxCount
                      ? selectedQueue.maxCount
                      : "Not Specified"}
                  </Text>
                </View>
              </View>
              <View style={styles.metaSection}>
                <Text style={styles.metaSectionTitle}>Business Message</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.metaSectionData}>
                    {selectedQueue.message}
                  </Text>
                </View>
              </View>
              <View style={styles.metaSection}>
                <Text style={styles.metaSectionTitle}>Hours</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.metaSectionData}>
                    {selectedQueue.hours.open} - {selectedQueue.hours.close}
                  </Text>
                </View>
              </View>
              <View style={styles.metaSection}>
                <Text style={styles.metaSectionTitle}>Phone Number</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.metaSectionData}>
                    {selectedQueue.businessNumber}
                  </Text>
                </View>
              </View>
              <View style={styles.metaSection}>
                <Text style={styles.metaSectionTitle}>City</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.metaSectionData}>
                    {selectedQueue.city}
                  </Text>
                </View>
              </View>
              <View style={styles.metaSection}>
                <Text style={styles.metaSectionTitle}>State</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.metaSectionData}>
                    {selectedQueue.state}
                  </Text>
                </View>
              </View>
              <View style={styles.metaSection}>
                <Text style={styles.metaSectionTitle}>Address</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.metaSectionData}>
                    {selectedQueue.address}
                  </Text>
                </View>
              </View>
              <View style={styles.metaSection}>
                <Text style={styles.metaSectionTitle}>Zipcode</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.metaSectionData}>
                    {selectedQueue.zipCode}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        ) : (
          <></>
        )}
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
  titleText: {
    fontSize: 30,
    color: "black",
    fontWeight: "300",
    textAlign: "center",
    flex: 1,
  },
  metaSection: {
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 5,
    marginRight: 15,
    marginLeft: 15,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0.84,

    elevation: 1,
    borderRadius: 9,
  },
  metaSectionCenter: {
    padding: 15,
    marginBottom: 5,
    marginRight: 15,
    marginLeft: 15,
    marginTop: 5,
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
  metaSectionCenterContent: {
    padding: 15,
    backgroundColor: "#8ecfd4",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0.84,

    elevation: 1,
    borderRadius: 9,
    // width: "50%",
    minWidth: 100,
    height: 100,
    // marginLeft: 50,
    // marginRight: 50,
    marginBottom: -10,
  },
  countTextContainer: {
    paddingTop: 50,
    paddingBottom: 50,
    backgroundColor: "#6da8bd",
    borderTopRightRadius: 9,
    borderTopLeftRadius: 9,
  },
  countText: {
    fontSize: 60,
    textAlign: "center",
    color: "white",
  },
  metaSectionFilterHide: {
    padding: 15,
    backgroundColor: "#a8a8a8",
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 5,
    marginRight: 15,
    marginLeft: 15,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0.84,

    elevation: 1,
    borderRadius: 9,
    textAlign: "center",
  },
  metaSectionFilter: {
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 5,
    marginRight: 15,
    marginLeft: 15,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0.84,

    elevation: 1,
    borderRadius: 9,
    textAlign: "center",
  },

  metaSectionLast: {
    padding: 15,
    marginBottom: 100,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 5,
    marginRight: 15,
    marginLeft: 15,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0.84,

    elevation: 1,
    borderRadius: 9,
  },
  metaSectionTitle: {
    fontWeight: "700",
    marginTop: 5,
    marginBottom: 5,
  },
  metaSectionData: {
    fontWeight: "300",
    fontSize: 20,
    marginTop: 5,
    marginBottom: 5,
  },
});
