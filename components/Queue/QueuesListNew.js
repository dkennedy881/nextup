import React, { useState, useEffect } from "react";

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
  TextInput,
  RefreshControl,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from "react-native";
let intValArray = [];
const QueuesListNew = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefreshing2, setIsRefreshing2] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [filteredQueues, setFilteredQueues] = useState(false);
  const [doShowInfo, setDoShowInfo] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);
  const [cities, setCities] = useState([]);
  const [typeSelected, setTypeSelected] = useState(null);
  const [queues, setQueues] = useState(null);
  const [filters, setFilters] = useState([
    "Early Voting",
    "Election Day",
    "Drop Off",
    "Drive Up",
    "24 Hours",
  ]);
  const cancelTokenSource = Axios.CancelToken.source();

  const getQueues = () => {
    console.log("getting");
    return new Promise(async (res, rej) => {
      try {
        let {
          data: queueDataA,
        } = await Axios.post(
          "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/nextup-ssnrm/service/getQueues/incoming_webhook/webhook0",
          { cancelToken: cancelTokenSource.token }
        );
        queueDataA = await queueDataA.reduce((queues, queueData) => {
          let newJSON = {
            title: queueData.title,
            message: queueData.message,
            monday: queueData.monday,
            tuesday: queueData.tuesday,
            wednesday: queueData.wednesday,
            thursday: queueData.thursday,
            friday: queueData.friday,
            saturday: queueData.saturday,
            sunday: queueData.sunday,
            active: queueData.active,
            count: queueData.count ? queueData.count["$numberLong"] : null,
            id: queueData.id["$numberLong"],
            address: queueData.address,
            zipCode: queueData.zipCode,
            city: queueData.city,
            state: queueData.state,
            maxCount: queueData.maxCount
              ? queueData.maxCount["$numberLong"]
              : null,
            mask: queueData.mask,
            sani: queueData.sani,
            businessNumber: queueData.businessNumber,
            stationCount: queueData.stationCount
              ? queueData.stationCount["$numberLong"]
              : null,
            estHours: queueData.estHours["$numberLong"],
            estMinutes: queueData.estMinutes["$numberLong"],
            county: queueData.county,
            statusLastUpdated: queueData.statusLastUpdated,
            source: queueData.source,
            isEarlyVoting: queueData.isEarlyVoting
              ? queueData.isEarlyVoting
              : false,
            isElectionDay: queueData.isElectionDay
              ? queueData.isElectionDay
              : true,
            isDropoff: queueData.isDropoff ? queueData.isDropoff : false,
            is24Hrs: queueData.is24Hrs ? queueData.is24Hrs : false,
            isDriveThru: queueData.isDriveThru ? queueData.isDriveThru : false,
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

  const runSearch = async (val) => {
    let tempStates = [];
    let tempCounties = [];
    let tempCities = [];
    let tempFilteredQueues = { active: [], inactive: [] };
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    if (val && !/^\s+/.test(val) && val !== "" && val.length > 0) {
      intValArray.forEach((time) => {
        clearTimeout(time);
        intValArray = [];
      });
      console.log("trying to run search");
      setStates(tempStates);
      setCounties(tempCounties);
      setCities(tempCities);
      setFilteredQueues(tempFilteredQueues);
      let intVal = setTimeout(async () => {
        await queues.forEach((queue, index) => {
          const { zipCode, city, state, county } = queue;

          if (typeSelected) {
            if (
              typeSelected.type === "state" &&
              queue.state !== typeSelected.data
            ) {
              return;
            } else {
              if (
                typeSelected.type === "county" &&
                `${queue.county} County, ${queue.state}` !== typeSelected.data
              ) {
                return;
              }
            }
          }

          if (
            zipCode === val ||
            city.includes(val) ||
            state.includes(val) ||
            county.includes(val)
          ) {
            tempStates = queue.state.includes(val)
              ? [...tempStates, queue.state]
              : [...tempStates];
            tempCounties = queue.county.includes(val)
              ? [...tempCounties, `${queue.county} County, ${queue.state}`]
              : [...tempCounties];
            tempCities = queue.city.includes(val)
              ? [...tempCities, `${queue.city}, ${queue.state}`]
              : [...tempCities];

            if (queue.zipCode === val) {
              if (queue.active) {
                tempFilteredQueues.active.push(queue);
              } else {
                tempFilteredQueues.inactive.push(queue);
              }
              tempFilteredQueues = tempFilteredQueues;
            }
            tempFilteredQueues.active = tempFilteredQueues.active.filter(
              onlyUnique
            );
            tempFilteredQueues.inactive = tempFilteredQueues.inactive.filter(
              onlyUnique
            );
          }
        });
        await setStates(tempStates.filter(onlyUnique));
        await setCounties(tempCounties.filter(onlyUnique));
        await setCities(tempCities.filter(onlyUnique));
        await setFilteredQueues(tempFilteredQueues);
      }, 500);
      intValArray.push(intVal);
    } else if (!/^\s+/.test(searchInput)) {
      await setStates(tempStates);
      await setCounties(tempCounties);
      await setCities(tempCities);
      await setIsRefreshing2(true);
      const allQueues = await getQueues();
      await setQueues(allQueues);
      allQueues.forEach((queue, index) => {
        if (typeSelected) {
          if (
            typeSelected.type === "state" &&
            queue.state !== typeSelected.data
          ) {
            return;
          } else {
            if (
              typeSelected.type === "county" &&
              `${queue.county} County, ${queue.state}` !== typeSelected.data
            ) {
              return;
            }
          }
        }
        tempStates = [...tempStates, queue.state];
        tempCounties = [
          ...tempCounties,
          `${queue.county} County, ${queue.state}`,
        ];
        tempCities = [...tempCities, `${queue.city}, ${queue.state}`];
      });
      await setStates(tempStates.filter(onlyUnique));
      await setCounties(tempCounties.filter(onlyUnique));
      await setCities(tempCities.filter(onlyUnique));
      if (typeSelected && typeSelected.type === "city") {
        await showQueues(typeSelected.data);
      }
      console.log("done");
      setIsRefreshing2(false);
    }
  };

  const onRefresh = async () => {
    await setIsRefreshing(true);

    if (typeSelected && typeSelected.type === "city") {
      await showQueues(typeSelected.data);
      await setIsRefreshing2(false);
    } else {
      await runSearch();
    }
    await setIsRefreshing(false);
  };

  const doRunSearch = async (val) => {
    runSearch(val);
    setSearchInput(val);
  };

  const filtersSelected = () => {
    const allOn = () => {
      return (
        filters.includes("Early Voting") &&
        filters.includes("Election Day") &&
        filters.includes("Drop Off") &&
        filters.includes("Drive Up") &&
        filters.includes("24 Hours")
      );
    };

    const allOff = () => {
      return (
        !filters.includes("Early Voting") &&
        !filters.includes("Election Day") &&
        !filters.includes("Drop Off") &&
        !filters.includes("Drive Up") &&
        !filters.includes("24 Hours")
      );
    };

    if (filters.length === 1) {
      return `${filters[0]} Locations`;
    } else {
      if (allOn() || allOff()) {
        return null;
      } else {
        return (
          filters.reduce((acc, cur, idx) => {
            if (idx === filters.length - 1) {
              acc = `${acc} & ${cur}`;
            } else {
              if (idx === filters.length - 2) {
                acc = `${acc} ${cur}`;
              } else {
                acc = `${acc} ${cur},`;
              }
            }
            return acc;
          }, "") + " Locations"
        );
      }
    }
  };

  const selectQueue = async (id) => {
    let queues;
    Keyboard.dismiss();
    try {
      queues = await getQueues();
    } catch (e) {
      alert(e);
    }

    let selected;
    for (const queue of queues) {
      // console.log(queue);
      if (queue.id == id) {
        selected = queue;
        break;
      }
    }
    if (!typeSelected) {
      setTypeSelected({
        type: "city",
        data: `${selected.city}, ${selected.state}`,
      });
    }
    setSelectedQueue(selected);
    setDoShowInfo(!doShowInfo);
  };

  const unSelectQueue = () => {
    setSelectedQueue(null);
  };

  const showQueues = async (selected) => {
    setIsRefreshing2(true);
    if (typeSelected && typeSelected.type === "city" && queues) {
      const filteredQueues = queues.reduce(
        (acc, cur) => {
          const [selectedCity, selectedState] = selected.split(", ");
          if (selectedCity === cur.city && selectedState === cur.state) {
            cur.active ? acc.active.push(cur) : acc.inactive.push(cur);
          }
          return acc;
        },
        { active: [], inactive: [] }
      );
      await setFilteredQueues(filteredQueues);
      setIsRefreshing2(false);
      return;
    }
    const queues = await getQueues();

    const filteredQueues = queues.reduce(
      (acc, cur) => {
        const [selectedCity, selectedState] = selected.split(", ");
        if (selectedCity === cur.city && selectedState === cur.state) {
          cur.active ? acc.active.push(cur) : acc.inactive.push(cur);
        }
        return acc;
      },
      { active: [], inactive: [] }
    );
    await setFilteredQueues(filteredQueues);
    if (typeSelected && typeSelected.type !== "city") {
      setTypeSelected({
        type: "city",
        data: selected,
      });
      return;
    }
    if (!typeSelected) {
      setTypeSelected({
        type: "city",
        data: selected,
      });
    }
  };

  const showList = (type = null) => {
    let itemsToShow = [];

    if (type) {
      switch (type) {
        case "county":
          return [
            ...itemsToShow,
            ...cities.reduce((acc, cur, index) => {
              acc.push(
                <FilterItem
                  selectQueue={() => {}}
                  unSelectQueue={() => {}}
                  key={`${cur}`}
                  name={`${cur}`}
                  setHandler={() => {
                    showQueues(cur);
                  }}
                />
              );
              return acc;
            }, []),
          ];
        case "state":
          return [
            ...itemsToShow,
            ...counties.reduce((acc, cur, index) => {
              acc.push(
                <FilterItem
                  selectQueue={() => {}}
                  unSelectQueue={() => {}}
                  key={`${cur}`}
                  name={`${cur}`}
                  setHandler={() => {
                    setStates([]);
                    setCounties([]);
                    setCities([]);
                    setTypeSelected({
                      type: "county",
                      data: cur,
                    });
                  }}
                />
              );
              return acc;
            }, []),
            // ...cities.reduce((acc, cur, index) => {
            //   acc.push(
            //     <FilterItem
            //       selectQueue={() => {}}
            //       unSelectQueue={() => {}}
            //       key={`${cur}`}
            //       name={`${cur}`}
            //       setHandler={() => {
            //         showQueues(cur);
            //       }}
            //     />
            //   );
            //   return acc;
            // }, []),
          ];
      }
    }

    if (searchInput === "" || searchInput === null) {
      itemsToShow = [
        ...itemsToShow,
        states.reduce((acc, cur, index) => {
          acc.push(
            <FilterItem
              selectQueue={() => {}}
              unSelectQueue={() => {}}
              key={`${cur}`}
              name={`${cur}`}
              setHandler={() => {
                setStates([]);
                setCounties([]);
                setCities([]);
                setTypeSelected({
                  type: "state",
                  data: cur,
                });
              }}
            />
          );
          return acc;
        }, []),
      ];
      return itemsToShow;
    }

    if (states.length) {
      itemsToShow = [
        ...itemsToShow,
        states.reduce((acc, cur, index) => {
          acc.push(
            <FilterItem
              selectQueue={() => {}}
              unSelectQueue={() => {}}
              key={`${cur}`}
              name={`${cur}`}
              setHandler={() => {
                setStates([]);
                setCounties([]);
                setCities([]);
                setTypeSelected({
                  type: "state",
                  data: cur,
                });
              }}
            />
          );
          return acc;
        }, []),
      ];
      // return itemsToShow;
    }

    if (counties.length) {
      itemsToShow = [
        ...itemsToShow,
        counties.reduce((acc, cur, index) => {
          acc.push(
            <FilterItem
              selectQueue={() => {}}
              unSelectQueue={() => {}}
              key={`${cur}`}
              name={`${cur}`}
              setHandler={() => {
                setStates([]);
                setCounties([]);
                setCities([]);
                setTypeSelected({
                  type: "county",
                  data: cur,
                });
              }}
            />
          );
          return acc;
        }, []),
      ];
    }

    if (cities.length) {
      itemsToShow = [
        ...itemsToShow,
        cities.reduce((acc, cur, index) => {
          acc.push(
            <FilterItem
              selectQueue={() => {}}
              unSelectQueue={() => {}}
              key={`${cur}`}
              name={`${cur}`}
              setHandler={() => {
                showQueues(cur);
              }}
            />
          );
          return acc;
        }, []),
      ];
    }

    if (
      filteredQueues &&
      (filteredQueues.active.length || filteredQueues.inactive.length)
    ) {
      itemsToShow = [
        ...itemsToShow,
        [...filteredQueues.active, ...filteredQueues.inactive].reduce(
          (acc, cur, index) => {
            acc.push(
              <Queue
                selectQueue={selectQueue}
                unSelectQueue={unSelectQueue}
                key={cur.id}
                queue={cur}
                index={index}
                list={[...filteredQueues.active, ...filteredQueues.inactive]}
              />
            );
            return acc;
          },
          []
        ),
      ];
    }

    return itemsToShow;
  };

  const goBack = async () => {
    let tempFilteredQueues = { active: [], inactive: [] };
    setStates([]);
    setCounties([]);
    setCities([]);
    setFilteredQueues(tempFilteredQueues);
    await setFilteredQueues(tempFilteredQueues);

    switch (typeSelected.type) {
      case "city":
        setTypeSelected({
          type: "county",
          data: `${
            [...filteredQueues.active, filteredQueues.active][0].county
          } County, ${
            [...filteredQueues.active, filteredQueues.active][0].state
          }`,
        });
        setDoShowInfo(!doShowInfo);
        break;
      case "county":
        setTypeSelected({
          type: "state",
          data: typeSelected.data.split(", ")[1],
        });
        setDoShowInfo(!doShowInfo);
        break;
      default:
        setTypeSelected(null);
        setDoShowInfo(!doShowInfo);
        break;
    }
  };

  const SearchComp = (type = null) => {
    return (
      <View
        // search content
        style={{
          flexDirection: "row",
          height: 40,
          alignItems: "center",
          marginTop: 5,
          marginLeft: 15,
          marginRight: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "80%",
            height: "90%",
            backgroundColor: "white",
            borderRadius: 9,
          }}
        >
          <Icon
            name={"search"}
            type="font-awesome"
            color="#eeee"
            size={23}
            style={{ marginTop: 5, marginLeft: 10 }}
          />
          <TextInput
            style={{ flex: 1, paddingLeft: 10 }}
            placeholder={`Find ${
              type
                ? type.type === "state"
                  ? `a county in ${type.data}`
                  : `a city in ${type.data}`
                : "a city, county or zip code"
            }`}
            backgroundColor="white"
            borderRadius={9}
            onChangeText={(val) => doRunSearch(val)}
            value={searchInput}
          />
        </View>
        <TouchableOpacity
          style={{
            marginLeft: 5,
            flexDirection: "row",
            justifyContent: "center",
            flex: 1,
            alignContent: "center",
            height: "90%",
          }}
          onPress={() => {
            setSearchInput(null);
            runSearch();
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{
                fontWeight: "900",
                color: "#6da8bd",
              }}
            >
              Clear
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const setCounterColor = () => {
    const { estMinutes, estHours } = selectedQueue;
    if (estHours > 0) {
      return styles.metaSectionCenterContentRed;
    }
    if (estMinutes > 39) {
      return styles.metaSectionCenterContentRed;
    }
    if (estMinutes > 24) {
      return styles.metaSectionCenterContentYellow;
    } else {
      return styles.metaSectionCenterContentGreen;
    }
  };

  const setCountText = () => {
    const { estMinutes, estHours } = selectedQueue;
    if (estHours > 1 || estMinutes < 25 || estMinutes > 39) {
      return styles.countText;
    } else {
      return {
        fontSize: 30,
        textAlign: "center",
        color: "white",
      };
    }
  };
  const setCountTextSub = () => {
    const { estMinutes, estHours } = selectedQueue;
    if (estHours > 0 || estMinutes < 24) {
      return styles.countTextSub;
    } else {
      return {
        fontSize: 15,
        textAlign: "center",
        color: "black",
      };
    }
  };

  const getFormattedTime = () => {
    const { estMinutes, estHours } = selectedQueue;
    const hourString =
      estHours > 0
        ? estHours > 1
          ? `${estHours} hours`
          : `${estHours} hour`
        : "";
    const minuteString =
      estMinutes > 0
        ? estMinutes > 1
          ? `${estMinutes} minutes`
          : `${estMinutes} minute`
        : "";

    return `${hourString} ${minuteString}`;
  };

  const updateFilters = async (filter) => {
    const foundIndex = filters.indexOf(filter);
    const updatedFilters = filters;
    if (foundIndex !== -1) {
      updatedFilters.splice(foundIndex, 1);
    } else {
      updatedFilters.push(filter);
    }
    let tempFilteredQueues = { active: [], inactive: [] };
    await setFilteredQueues(tempFilteredQueues);
    await setFilters(updatedFilters);
    runSearch();
  };

  const shouldFilterQueue = (q) => {
    const allOn = () => {
      return (
        filters.includes("Early Voting") &&
        filters.includes("Election Day") &&
        filters.includes("Drop Off") &&
        filters.includes("Drive Up") &&
        filters.includes("24 Hours")
      );
    };

    const allOff = () => {
      return (
        !filters.includes("Early Voting") &&
        !filters.includes("Election Day") &&
        !filters.includes("Drop Off") &&
        !filters.includes("Drive Up") &&
        !filters.includes("24 Hours")
      );
    };

    if (allOn() || allOff()) {
      return true;
    }

    let shouldShow = false;
    if (filters.includes("Early Voting") && q.isEarlyVoting) {
      shouldShow = true;
    }
    if (filters.includes("Election Day") && q.isElectionDay) {
      shouldShow = true;
    }
    if (filters.includes("Drop Off") && q.isDropoff) {
      shouldShow = true;
    }
    if (filters.includes("Drive Up") && q.isDriveThru) {
      shouldShow = true;
    }
    if (filters.includes("24 Hours") && q.is24Hrs) {
      shouldShow = true;
    }

    return shouldShow;
  };

  //on mount
  useEffect(() => {
    setSearchInput("");
    runSearch();
  }, []);

  //type selected
  useEffect(() => {
    setSearchInput(null);
    runSearch();
  }, [typeSelected]);

  return (
    <React.Fragment>
      <HeaderContainer
        unSelectType={() => {
          goBack();
        }}
        typeSelected={typeSelected}
        queueMember={true}
        selectedQueue={selectedQueue}
        doShowInfo={doShowInfo}
        filters={filters}
        setChecked={(filter) => {
          updateFilters(filter);
        }}
      ></HeaderContainer>
      <SafeAreaView
        //main body
        style={{
          flex: 1,
          backgroundColor: `${selectedQueue ? "#9191" : "#f5f5f5"}`,
        }}
      >
        {!typeSelected ? (
          <>
            {SearchComp()}
            <ScrollView
              keyboardShouldPersistTaps={"always"}
              contentContainerStyle={styles.QueuesListContainer}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                />
              }
            >
              {showList()}
            </ScrollView>
          </>
        ) : typeSelected.type === "city" ? (
          <>
            {filtersSelected() ? (
              <View>
                <Text style={{ textAlign: "center", marginTop: 8, padding: 3 }}>
                  {filtersSelected()}
                </Text>
              </View>
            ) : (
              <></>
            )}
            {isRefreshing2 ? (
              <View>
                <Text style={{ textAlign: "center", margin: 10 }}>
                  Loading Data
                </Text>
                <ActivityIndicator size="large" />
              </View>
            ) : (
              <ScrollView
                keyboardShouldPersistTaps={"always"}
                contentContainerStyle={styles.QueuesListContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                {[...filteredQueues.active, ...filteredQueues.inactive]
                  .filter((q) => {
                    return shouldFilterQueue(q);
                  })
                  .map((item, index) => (
                    <Queue
                      selectQueue={selectQueue}
                      unSelectQueue={unSelectQueue}
                      key={item.id}
                      queue={item}
                      index={index}
                      list={[
                        ...filteredQueues.active,
                        ...filteredQueues.inactive,
                      ]}
                    />
                  ))}
              </ScrollView>
            )}
          </>
        ) : (
          <>
            {SearchComp(typeSelected)}
            <ScrollView
              keyboardShouldPersistTaps={"always"}
              contentContainerStyle={styles.QueuesListContainer}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                />
              }
            >
              {showList(typeSelected.type)}
            </ScrollView>
          </>
        )}
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
              paddingBottom: 30,
              marginBottom: 100,
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
              <View style={{ flex: 1, minHeight: 50 }}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={styles.titleText}>{selectedQueue.title}</Text>
                </View>
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
                <View style={setCounterColor()}>
                  <Text style={setCountText()}>{getFormattedTime()}</Text>
                </View>
              </View>
              <View style={styles.metaSectionCenterSub}>
                {selectedQueue.count ? (
                  <View style={styles.metaLilButtonContainer}>
                    <Text
                      style={styles.metaLilButtonContainerText}
                    >{`${selectedQueue.count} in line`}</Text>
                  </View>
                ) : (
                  <></>
                )}
                {selectedQueue.stationCount ? (
                  <View style={styles.metaLilButtonContainer}>
                    <Text style={styles.metaLilButtonContainerText}>
                      {selectedQueue.stationCount
                        ? `${selectedQueue.stationCount} stations`
                        : "Station # Not Specified"}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
                {selectedQueue.maxCount ? (
                  <View style={styles.metaLilButtonContainer}>
                    <Text style={styles.metaLilButtonContainerText}>
                      {selectedQueue.maxCount
                        ? `Max Capacity ${selectedQueue.maxCount}`
                        : "Not Specified"}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
              </View>
              <View style={styles.metaSectionCenterSub2}>
                {selectedQueue.isEarlyVoting ? (
                  <View style={styles.metaLilButtonContainer}>
                    <Text style={styles.metaLilButtonContainerText}>
                      {"Early Voting"}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
                {selectedQueue.isElectionDay ? (
                  <View style={styles.metaLilButtonContainer}>
                    <Text style={styles.metaLilButtonContainerText}>
                      {"Election Day"}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
                {selectedQueue.is24Hrs ? (
                  <View style={styles.metaLilButtonContainer}>
                    <Text style={styles.metaLilButtonContainerText}>
                      {"Open 24 Hours"}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
              </View>
              <View style={styles.metaSectionCenterSub2}>
                {selectedQueue.isDropoff ? (
                  <View style={styles.metaLilButtonContainer}>
                    <Text style={styles.metaLilButtonContainerText}>
                      {"Drop Off Available"}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
                {selectedQueue.isDriveThru ? (
                  <View style={styles.metaLilButtonContainer}>
                    <Text style={styles.metaLilButtonContainerText}>
                      {"Drive Up Available"}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
              </View>
              <View style={styles.metaSectionNoBg}>
                <Text style={styles.metaSectionTitleNoBg}>What to Know</Text>
              </View>
              {!selectedQueue.active ? (
                <View style={styles.metaSectionNoBg}>
                  <Text style={styles.metaSectionTitleNoBgSM}>
                    Currently Unavailable
                  </Text>
                </View>
              ) : null}
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
              {/* <View style={styles.metaSection}>
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
              </View> */}
              {selectedQueue.message ? (
                <View style={styles.metaSection}>
                  <Text style={styles.metaSectionTitle}>Location Message</Text>
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
              ) : (
                <></>
              )}

              <View style={styles.metaSection}>
                <Text style={styles.metaSectionTitle}>Hours of Operation</Text>
                {/* <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View>
                    <View
                      style={{ width: "100%", flex: 1, flexDirection: "row" }}
                    >
                      <Text
                        style={{
                          width: 110,
                          fontWeight: "300",
                          fontSize: 20,
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        Monday
                      </Text>
                      <Text
                        style={{
                          fontWeight: "300",
                          fontSize: 20,
                          marginTop: 5,
                          marginBottom: 5,
                          textAlign: "center",
                        }}
                      >
                        {selectedQueue.monday.active
                          ? selectedQueue.monday.open +
                            " - " +
                            selectedQueue.monday.close
                          : "Closed"}
                      </Text>
                    </View>
                  </View>
                </View> */}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View>
                    <View style={{ width: "100%", flexDirection: "row" }}>
                      <Text
                        style={{
                          width: 110,
                          fontWeight: "300",
                          fontSize: 20,
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        Tuesday
                      </Text>
                      <Text
                        style={{
                          fontWeight: "300",
                          fontSize: 20,
                          marginTop: 6,
                          marginBottom: 5,
                        }}
                      >
                        {selectedQueue.tuesday.active
                          ? selectedQueue.tuesday.open +
                            " - " +
                            selectedQueue.tuesday.close
                          : "Closed"}
                      </Text>
                    </View>
                  </View>
                </View>
                {/* <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View>
                    <View style={{ width: "100%", flexDirection: "row" }}>
                      <Text
                        style={{
                          width: 110,
                          fontWeight: "300",
                          fontSize: 20,
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        Wednesday
                      </Text>
                      <Text
                        style={{
                          fontWeight: "300",
                          fontSize: 20,
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        {selectedQueue.wednesday.active
                          ? selectedQueue.wednesday.open +
                            " - " +
                            selectedQueue.wednesday.close
                          : "Closed"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View>
                    <View style={{ width: "100%", flexDirection: "row" }}>
                      <Text
                        style={{
                          width: 110,
                          fontWeight: "300",
                          fontSize: 20,
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        Thursday
                      </Text>
                      <Text
                        style={{
                          fontWeight: "300",
                          fontSize: 20,
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        {selectedQueue.thursday.active
                          ? selectedQueue.thursday.open +
                            " - " +
                            selectedQueue.thursday.close
                          : "Closed"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View>
                    <View style={{ width: "100%", flexDirection: "row" }}>
                      <Text
                        style={{
                          width: 110,
                          fontWeight: "300",
                          fontSize: 20,
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        Friday
                      </Text>
                      <Text
                        style={{
                          fontWeight: "300",
                          fontSize: 20,
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        {selectedQueue.friday.active
                          ? selectedQueue.friday.open +
                            " - " +
                            selectedQueue.friday.close
                          : "Closed"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View>
                    <View style={{ width: "100%", flexDirection: "row" }}>
                      <Text
                        style={{
                          width: 110,
                          fontWeight: "300",
                          fontSize: 20,
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        Saturday
                      </Text>
                      <Text
                        style={{
                          fontWeight: "300",
                          fontSize: 20,
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        {selectedQueue.saturday.active
                          ? selectedQueue.saturday.open +
                            " - " +
                            selectedQueue.saturday.close
                          : "Closed"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <View>
                    <View style={{ width: "100%", flexDirection: "row" }}>
                      <Text
                        style={{
                          width: 110,
                          fontWeight: "300",
                          fontSize: 20,
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        Sunday
                      </Text>
                      <Text
                        style={{
                          fontWeight: "300",
                          fontSize: 20,
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        {selectedQueue.sunday.active
                          ? selectedQueue.sunday.open +
                            " - " +
                            selectedQueue.sunday.close
                          : "Closed"}
                      </Text>
                    </View>
                  </View>
                </View> */}
              </View>
              {selectedQueue.businessNumber !== null &&
              selectedQueue.businessNumber !== "" ? (
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
              ) : (
                <></>
              )}
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
              <View style={styles.metaSection}>
                <Text style={styles.metaSectionTitle}>Data Source</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.metaSectionData}>
                    {selectedQueue.source}
                  </Text>
                </View>
              </View>
              {selectedQueue.statusLastUpdated ? (
                <View style={styles.metaSection}>
                  <Text style={styles.metaSectionTitle}>Last Updated</Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Text style={styles.metaSectionData}>
                      {new Date(
                        selectedQueue.statusLastUpdated
                      ).toLocaleString()}
                    </Text>
                  </View>
                </View>
              ) : (
                <></>
              )}
            </ScrollView>
          </View>
        ) : (
          <></>
        )}
      </SafeAreaView>
    </React.Fragment>
  );
};

export default QueuesListNew;

const styles = StyleSheet.create({
  metaLilButtonContainer: {
    marginLeft: 5,
    marginRight: 5,
    borderStyle: "solid",
    borderWidth: 0.5,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 9,
    backgroundColor: "#8ecfd4",
    borderColor: "#eee",
    color: "white",
  },
  metaLilButtonContainerText: {
    color: "white",
  },
  QueuesListContainer: {
    borderColor: "#eeee",
    borderStyle: "solid",
    // overflow: 'scroll',
    position: "relative",
    top: 1,
    flexGrow: 1,
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
    flexWrap: "wrap",
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
  metaSectionCenterSub: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
  metaSectionCenterSub2: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    marginTop: 5,
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
  metaSectionCenterContentRed: {
    padding: 15,
    backgroundColor: "red",
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
    // height: 80,
    alignSelf: "center",
    // marginLeft: 50,
    // marginRight: 50,
    // marginBottom: -10,
  },
  metaSectionCenterContentGreen: {
    padding: 15,
    backgroundColor: "#57ab53",
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
    alignSelf: "center",
    // marginLeft: 50,
    // marginRight: 50,
    // marginBottom: -10,
  },
  metaSectionCenterContentYellow: {
    padding: 15,
    backgroundColor: "#ffdf6d",
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
    alignSelf: "center",
    // marginLeft: 50,
    // marginRight: 50,
  },
  countTextContainer: {
    paddingTop: 50,
    paddingBottom: 50,
    backgroundColor: "#6da8bd",
    borderTopRightRadius: 9,
    borderTopLeftRadius: 9,
  },
  countText: {
    fontSize: 30,
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
  metaSectionTitleNoBgSM: {
    fontWeight: "300",
    marginTop: -15,
    marginBottom: 5,
    fontSize: 15,
    textAlign: "center",
  },
  metaSectionData: {
    fontWeight: "300",
    fontSize: 20,
    marginTop: 5,
    marginBottom: 5,
  },
});
