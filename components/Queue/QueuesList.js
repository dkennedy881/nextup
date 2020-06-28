import React, { useState, Component } from "react";
import Axios from "axios";
import { Icon } from "react-native-elements";

//comps
import Queue from "./Queue";
import FilterItem from "./FilterItem";
import HeaderContainer from "../Header/HeaderContainer";

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList,
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
      locationObjs: false,
      selectedLocationObj: false,
      selectedLocationObjReal: false,
      filteredQueues: false,
    };
  }

  selectLocation = async (location) => {
    let queues = [];
    try {
      queues = await this.getQueues();
    } catch (e) {
      alert(e);
    }
    let filteredQueues = queues.reduce((acc, cur) => {
      if (cur.state === location.state && cur.city === location.city) {
        acc.push(cur);
      }
      if (
        (cur.city === "" || cur.city === null) &&
        location.city === "City Not Specified"
      ) {
        acc.push(cur);
      }
      return acc;
    }, []);
    this.setState({
      filteredQueues,
      selectedLocationObj: `${location.city}, ${location.state}`,
      selectedLocationObjReal: JSON.parse(JSON.stringify(location)),
      isRefreshing: false,
    });
  };

  selectQueue = async (id) => {
    let queues;
    try {
      queues = await this.getQueues();
    } catch (e) {
      alert(e);
    }
    const selected = queues.filter((q) => {
      return q.id === id;
    })[0];
    this.setState({ selectedQueue: selected });
  };

  unSelectLocation = async () => {
    await this.setState({
      selectedLocationObj: false,
      selectedLocationObjReal: false,
    });
  };
  unSelectQueue = () => {
    this.setState({ selectedQueue: false });
    this.onRefresh();
  };

  onRefresh = async () => {
    await this.setState({ isRefreshing: true });

    let queues = [];
    let locationObjs;
    try {
      queues = await this.getQueues();
    } catch (e) {
      alert(e);
    }

    if (this.state.selectedLocationObj) {
      this.selectLocation(this.state.selectedLocationObjReal);
      return;
    } else {
      locationObjs = queues.reduce((acc, cur) => {
        const newObj = {
          city: cur.city ? cur.city : "City Not Specified",
          state: cur.state,
        };
        if (!this.containsObj(newObj, acc)) {
          acc.push(newObj);
        }
        return acc;
      }, []);
    }

    setTimeout(() => {
      this.setState((state) => ({
        ...state,
        queues,
        filteredQueues: queues,
        locationObjs,
        isSet: !state.isSet,
        isRefreshing: false,
      }));
    }, 1000);
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

  containsObj(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
        return true;
      }
    }

    return false;
  }

  async componentDidMount() {
    if (!this.state.isSet) {
      try {
        let queues = await this.getQueues();

        let locationObjs = queues.reduce((acc, cur) => {
          const newObj = {
            city: cur.city ? cur.city : "City Not Specified",
            state: cur.state,
          };
          if (!this.containsObj(newObj, acc)) {
            acc.push(newObj);
          }
          return acc;
        }, []);

        this.setState((state) => ({
          ...state,
          locationObjs,
          queues,
          isSet: !state.isSet,
        }));
      } catch (e) {
        alert(e);
      }
    }
  }

  render() {
    let {
      isRefreshing,
      selectedQueue,
      locationObjs,
      filteredQueues,
      selectedLocationObj,
    } = this.state;
    let {
      onRefresh,
      selectQueue,
      unSelectQueue,
      unSelectLocation,
      selectLocation,
    } = this;
    return (
      <React.Fragment>
        <HeaderContainer
          unSelectLocation={unSelectLocation}
          selectedLocationObj={selectedLocationObj}
          queueMember={true}
          selectedQueue={selectedQueue}
        ></HeaderContainer>

        <SafeAreaView
          style={{
            flex: 1,
            display: "flex",
            backgroundColor: `${selectedQueue ? "#9191" : "#f5f5f5"}`,
          }}
        >
          <ScrollView
            contentContainerStyle={styles.QueuesListContainer}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          >
            <View>
              {selectedLocationObj === false ? (
                <FlatList
                  data={locationObjs}
                  renderItem={({ item }) => (
                    <FilterItem
                      selectQueue={selectQueue}
                      unSelectQueue={unSelectLocation}
                      key={`${item.city}-${item.state}`}
                      name={`${item.city}, ${item.state}`}
                      obj={{ city: item.city, state: item.state }}
                      setHandler={selectLocation}
                    />
                  )}
                  keyExtractor={(item) => String(`${item.city}-${item.state}`)}
                />
              ) : (
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
              )}
            </View>
          </ScrollView>
          {selectedQueue ? (
            <View
              style={{
                width: "100%",
                backgroundColor: "#f5f5f5",
                position: "absolute",
                top: "-7%",
                height: "112.5%",
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
                  borderTopRightRadius: 9,
                  borderTopLeftRadius: 9,
                  borderBottomColor: "",
                  backgroundColor: "white",
                  padding: 5,
                  borderWidth: 1,
                  borderColor: "#eee",
                  alignContent: "center",
                  shadowColor: "#f5f5f5",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowRadius: 0.5,
                  shadowOpacity: 1,
                }}
              >
                <View style={{ width: 30 }}></View>
                <View style={{ flex: 1, height: 50 }}>
                  <Text style={styles.titleText}>{selectedQueue.title}</Text>
                  <Text style={styles.titleTextSub}>
                    {`${selectedQueue.address}, ${selectedQueue.zipCode}`}
                  </Text>
                </View>
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
                    color="salmon"
                    size={30}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView>
                <View style={styles.metaSectionCenter}>
                  <View style={styles.metaSectionCenterContent}>
                    <Text style={styles.countText}>{selectedQueue.count}</Text>
                    <Text style={styles.countTextSub}>{"in line"}</Text>
                  </View>
                </View>
                <View style={styles.metaSectionNoBg}>
                  <Text style={styles.metaSectionTitleNoBg}>What to Know</Text>
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
                  <Text style={styles.metaSectionTitle}>
                    Sanitizer Available
                  </Text>
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
      </React.Fragment>
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
  titleTextSub: {
    fontSize: 10,
    color: "black",
    fontWeight: "300",
    textAlign: "center",
  },
  metaSection: {
    padding: 15,
    paddingLeft: 65,
    paddingRight: 65,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 5,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0.84,

    elevation: 1,
  },
  metaSectionNoBg: {
    padding: 15,
    paddingLeft: 65,
    paddingRight: 65,
    marginBottom: -5,
    marginTop: 5,
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
    minWidth: 110,
    height: 110,
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
  countTextSub: {
    fontSize: 15,
    textAlign: "center",
    color: "yellow",
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
    backgroundColor: "white",
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

  metaSectionFilterText: {
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
    fontSize: 22,
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
  metaSectionTitleNoBg: {
    fontWeight: "300",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 25,
    textAlign: "center",
  },
  metaSectionData: {
    fontWeight: "300",
    fontSize: 20,
    marginTop: 5,
    marginBottom: 5,
  },
});
