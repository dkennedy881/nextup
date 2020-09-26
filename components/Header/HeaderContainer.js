import React, { useState } from "react";
import { Icon } from "react-native-elements";

import { View, Text, Image, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";

function HeaderContainer({
  selectedLocationObj,
  unSelectLocation,
  selectedQueue,
}) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      {/* {showInfo ? (
        // <View
        //   style={{
        //     zIndex: 1,
        //     height: "100%",
        //     width: "100%",
        //     position: "absolute",
        //     justifyContent: "center",
        //   }}
        //   onPress={() => alert()}
        // >
        <View
          style={{
            zIndex: 1,
            height: 500,
            flexDirection: "row",
            justifyContent: "center",
            position: "absolute",
            backgroundColor: "blue",
            top: 150,
            left: 45,
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "red",
              zIndex: 1,
              height: 500,
            }}
          >
            <LinearGradient colors={["red", "yellow", "green"]}>
              <Text>Vertical Gradient</Text>
            </LinearGradient>
          </View>
        </View>
      ) : (
        // </View>
        <></>
      )} */}
      {selectedLocationObj ? (
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
                  unSelectLocation();
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
              <TouchableOpacity
                style={styles.HeaderItemSM}
                onPress={() => {
                  unSelectLocation();
                }}
              ></TouchableOpacity>
              <View style={styles.TitleContainer}>
                <Text style={{ fontSize: 10 }}>{selectedLocationObj}</Text>
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
                // onPress={() => {
                // setShowInfo(!showInfo);
                // alert();
                // }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    top: -10,
                  }}
                >
                  {/* <Icon
                    name={"info-circle"}
                    type="font-awesome"
                    color="#6da8bd"
                    size={23}
                    style={{ marginLeft: 10 }}
                  /> */}
                </View>
              </TouchableOpacity>
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
                  unSelectLocation();
                }}
              ></TouchableOpacity>
            </View>
            <View style={styles.HeaderItems}>
              <TouchableOpacity
                style={styles.HeaderItemSM}
                onPress={() => {
                  unSelectLocation();
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
                  unSelectLocation();
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
  HeaderContainer: {
    height: "11%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#eee",
    alignContent: "center",
    shadowColor: "red",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    shadowOpacity: 5,
    paddingTop: 68,
  },
  HeaderContainerHide: {
    height: "11%",
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
  },
  HeaderItems: {
    flexDirection: "row",
    justifyContent: "space-evenly",
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
