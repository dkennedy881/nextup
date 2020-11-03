import React, { useState, useEffect } from "react";
import { Icon, CheckBox } from "react-native-elements";

import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function HeaderContainer({
  typeSelected,
  unSelectType,
  selectedQueue,
  doShowInfo,
  setChecked,
  filters,
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [infoType, setInfoType] = useState(null);

  useEffect(() => {
    setShowInfo(false);
  }, [doShowInfo]);

  const showOption = () => {
    switch (typeSelected.type) {
      case "city":
        return (
          <View style={{ flexDirection: "row", width: 100 }}>
            <TouchableOpacity
              style={{
                position: "relative",
                overflow: "visible",
                marginRight: 5,
              }}
              onPress={() => {
                setInfoType("filter");
                setShowInfo(!showInfo);
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  top: -10,
                }}
              >
                <Icon
                  name={"filter"}
                  type="font-awesome"
                  color={
                    showInfo && infoType === "filter" ? "salmon" : "#6da8bd"
                  }
                  size={23}
                  style={{ marginLeft: 10 }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                position: "relative",
                overflow: "visible",
                marginLeft: 5,
              }}
              onPress={() => {
                setInfoType("key");
                setShowInfo(!showInfo);
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  top: -10,
                }}
              >
                <Icon
                  name={"info-circle"}
                  type="font-awesome"
                  color={
                    showInfo && infoType !== "filter" ? "salmon" : "#6da8bd"
                  }
                  size={23}
                  style={{ marginLeft: 10 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        );
      default:
        return (
          <View
            style={{
              width: 100,
            }}
          ></View>
        );
    }
  };

  const showInfoType = () => {
    switch (infoType) {
      case "key":
        return (
          <View
            style={{
              zIndex: 1,
              height: 350,
              flexDirection: "row",
              position: "absolute",
              backgroundColor: "white",
              top: 250,
              left: 75,
              width: "65%",
              borderRadius: 9,
              shadowColor: "#000",
              shadowOffset: {
                width: 5,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
              borderRadius: 9,
            }}
          >
            <LinearGradient
              // Button Linear Gradient
              colors={["#ff0000", "#fffa00", "#0ade00"]}
              style={{
                position: "absolute",
                left: 10,
                right: 0,
                top: 0,
                height: 320,
                width: 20,
                marginTop: 15,
                marginBottom: 25,
                marginLeft: 15,
                marginRight: 15,
              }}
            />
            <View
              style={{
                position: "absolute",
                left: 60,
                height: 350,
                width: "55%",
              }}
            >
              <View style={{ height: "33%", paddingTop: 10 }}>
                <View style={styles.keyItem}>
                  <Text style={styles.keyItemText}>UNACCEPTABLE:</Text>
                  <Text style={styles.keyItemTextSub}>40+ minutes</Text>
                </View>
              </View>
              <View style={{ height: "33%", justifyContent: "center" }}>
                <View style={styles.keyItem}>
                  <Text style={styles.keyItemText}>OKAY:</Text>
                  <Text style={styles.keyItemTextSub}>25 - 39 minutes</Text>
                </View>
              </View>
              <View
                style={{
                  height: "33%",
                  flexDirection: "column-reverse",
                  paddingBottom: 10,
                }}
              >
                <View style={styles.keyItem}>
                  <Text style={styles.keyItemText}>GOOD:</Text>
                  <Text style={styles.keyItemTextSub}>0 - 24 minutes</Text>
                </View>
              </View>
            </View>
          </View>
        );

      case "filter":
        return (
          <View
            style={{
              zIndex: 1,
              height: 350,
              position: "absolute",
              backgroundColor: "white",
              justifyContent: "center",
              top: 250,
              left: 75,
              width: "65%",
              borderRadius: 9,
              shadowColor: "#000",
              shadowOffset: {
                width: 5,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
              borderRadius: 9,
            }}
          >
            <View
              style={{
                marginLeft: 25,
              }}
            >
              <Text style={styles.keyItemText}>Filter By:</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <CheckBox
                containerStyle={{
                  backgroundColor: "white",
                  borderColor: "white",
                }}
                textStyle={{ color: "black", fontWeight: "300" }}
                iconRight={true}
                checkedColor={"#6da8bd"}
                checked={filters.includes("Early Voting")}
                onPress={() => {
                  // setInfoType(null);
                  // setShowInfo(false);
                  setChecked("Early Voting");
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  // setInfoType(null);
                  // setShowInfo(false);
                  setChecked("Early Voting");
                }}
              >
                <Text>Early Voting</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <CheckBox
                containerStyle={{
                  backgroundColor: "white",
                  borderColor: "white",
                }}
                textStyle={{ color: "black", fontWeight: "300" }}
                iconRight={true}
                checkedColor={"#6da8bd"}
                checked={filters.includes("Election Day")}
                onPress={() => {
                  // setInfoType(null);
                  // setShowInfo(false);
                  setChecked("Election Day");
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  // setInfoType(null);
                  // setShowInfo(false);
                  setChecked("Election Day");
                }}
              >
                <Text>Election Day</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <CheckBox
                containerStyle={{
                  backgroundColor: "white",
                  borderColor: "white",
                }}
                textStyle={{ color: "black", fontWeight: "300" }}
                iconRight={true}
                checkedColor={"#6da8bd"}
                checked={filters.includes("Drop Off")}
                onPress={() => {
                  // setInfoType(null);
                  // setShowInfo(false);
                  setChecked("Drop Off");
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  // setInfoType(null);
                  // setShowInfo(false);
                  setChecked("Drop Off");
                }}
              >
                <Text>Drop Off</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <CheckBox
                containerStyle={{
                  backgroundColor: "white",
                  borderColor: "white",
                }}
                textStyle={{ color: "black", fontWeight: "300" }}
                iconRight={true}
                checkedColor={"#6da8bd"}
                checked={filters.includes("Drive Up")}
                onPress={() => {
                  // setInfoType(null);
                  // setShowInfo(false);
                  setChecked("Drive Up");
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  // setInfoType(null);
                  // setShowInfo(false);
                  setChecked("Drive Up");
                }}
              >
                <Text>Drive Up</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <CheckBox
                containerStyle={{
                  backgroundColor: "white",
                  borderColor: "white",
                }}
                textStyle={{ color: "black", fontWeight: "300" }}
                iconRight={true}
                checkedColor={"#6da8bd"}
                checked={filters.includes("24 Hours")}
                onPress={() => {
                  // setInfoType(null);
                  // setShowInfo(false);
                  setChecked("24 Hours");
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  // setInfoType(null);
                  // setShowInfo(false);
                  setChecked("24 Hours");
                }}
              >
                <Text>24 Hours</Text>
              </TouchableOpacity>
            </View>
            {/* <LinearGradient
        // Button Linear Gradient
        colors={["#ff0000", "#fffa00", "#0ade00"]}
        style={{
          position: "absolute",
          left: 10,
          right: 0,
          top: 0,
          height: 320,
          width: 20,
          marginTop: 15,
          marginBottom: 25,
          marginLeft: 15,
          marginRight: 15,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: 60,
          height: 350,
          width: "55%",
        }}
      >
        <View style={{ height: "33%", paddingTop: 10 }}>
          <View style={styles.keyItem}>
            <Text style={styles.keyItemText}>UNACCEPTABLE:</Text>
            <Text style={styles.keyItemTextSub}>30 minutes plus</Text>
          </View>
        </View>
        <View style={{ height: "33%", justifyContent: "center" }}>
          <View style={styles.keyItem}>
            <Text style={styles.keyItemText}>OKAY:</Text>
            <Text style={styles.keyItemTextSub}>16 - 29 minutes</Text>
          </View>
        </View>
        <View
          style={{
            height: "33%",
            flexDirection: "column-reverse",
            paddingBottom: 10,
          }}
        >
          <View style={styles.keyItem}>
            <Text style={styles.keyItemText}>GOOD:</Text>
            <Text style={styles.keyItemTextSub}>0 - 15 minutes</Text>
          </View>
        </View>
      </View> */}
          </View>
        );
    }
  };

  return (
    <>
      {showInfo ? showInfoType() : <></>}
      {typeSelected ? (
        <View
          style={
            selectedQueue ? styles.HeaderContainerHide : styles.HeaderContainer
          }
        >
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View>
              <TouchableOpacity
                style={{
                  position: "relative",
                  overflow: "visible",
                  width: 100,
                  top: -8,
                  left: 15,
                }}
                onPress={() => {
                  unSelectType();
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name={"chevron-left"}
                    type="font-awesome"
                    color="#6da8bd"
                    size={23}
                    style={{ marginLeft: 10 }}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      marginLeft: 10,
                      fontWeight: "900",
                      color: "#6da8bd",
                    }}
                  >
                    Back
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.HeaderItems}>
              {/* <TouchableOpacity
                style={styles.HeaderItemSM}
                onPress={() => {
                  unSelectType();
                }}
              ></TouchableOpacity> */}
              <View style={styles.TitleContainer}>
                <Text style={{ fontSize: 10 }}>{`${typeSelected.data}`}</Text>
                <Image
                  style={{ width: 120, height: 40 }}
                  source={require("../../images/next-up.png")}
                />
              </View>
              {/* <TouchableOpacity style={styles.HeaderItemSM} /> */}
            </View>
            <View>
              {typeSelected ? (
                showOption()
              ) : (
                <View
                  style={{
                    width: 100,
                  }}
                ></View>
              )}
            </View>
          </View>
        </View>
      ) : (
        <View
          style={
            selectedQueue ? styles.HeaderContainerHide : styles.HeaderContainer
          }
        >
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View>
              <TouchableOpacity
                style={{
                  position: "relative",
                  overflow: "visible",
                  width: 100,
                  top: -10,
                }}
                onPress={() => {
                  unSelectType();
                }}
              ></TouchableOpacity>
            </View>
            <View style={styles.HeaderItems}>
              <TouchableOpacity
                style={styles.HeaderItemSM}
                onPress={() => {
                  unSelectType();
                }}
              ></TouchableOpacity>
              <View style={styles.TitleContainer}>
                <View style={{ minHeight: 12 }}></View>
                <Image
                  style={{ width: 120, height: 40 }}
                  source={require("../../images/next-up.png")}
                />
              </View>
              <TouchableOpacity style={styles.HeaderItemSM} />
            </View>
            <View>
              <TouchableOpacity
                style={{
                  position: "relative",
                  overflow: "visible",
                  width: 100,
                }}
                onPress={() => {
                  unSelectType();
                }}
              ></TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = {
  keyItem: {},
  keyItemText: {
    fontWeight: "600",
  },
  keyItemTextSub: {
    fontWeight: "400",
  },
  HeaderContainer: {
    height: "13%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#eee",
    alignContent: "center",
    shadowColor: "#eee",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    shadowOpacity: 5,
    paddingTop: 55,
    justifyContent: "center",
  },
  HeaderContainerHide: {
    height: "13%",
    flexDirection: "column-reverse",
    backgroundColor: "#5a5a5a",
    borderWidth: 1,
    alignContent: "center",
    shadowColor: "red",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    shadowOpacity: 5,
    paddingTop: 105,
    justifyContent: "center",
  },
  HeaderItems: {
    flexDirection: "row",
    justifyContent: "center",
    height: "50%",
    flex: 1,
  },
  HeaderItemsR2: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  HeaderItemSM: {
    flex: 1,
    textAlign: "center",
    flexDirection: "column-reverse",
    width: "33%",
    // paddingBottom:10
  },
  LogoBtnText: {
    textAlign: "center",
    fontSize: 15,
  },
  TitleContainer: {
    flex: 2,
    flexDirection: "column-reverse",
    position: "relative",
    marginTop: -15,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    whiteSpace: "no-wrap",
  },
  TitleText: {
    textAlign: "center",
    fontSize: 25,
  },
  SettingsBtnText: {
    textAlign: "center",
    fontSize: 15,
  },
};

export default HeaderContainer;
