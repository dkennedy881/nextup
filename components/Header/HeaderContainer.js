import React, { useState } from "react";
import { Icon } from "react-native-elements";

import { View, Text, Image, TouchableOpacity } from "react-native";

function HeaderContainer({
  toggleSettings,
  selectedLocationObj,
  unSelectLocation,
  selectedQueue,
}) {
  const [showSettings, setShowSettings] = useState(false);

  return selectedLocationObj ? (
    <View
      style={
        selectedQueue ? styles.HeaderContainerHide : styles.HeaderContainer
      }
    >
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
            top: 30,
            overflow: "visible",
            width: 100,
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
    </View>
  ) : (
    <View style={styles.HeaderContainer}>
      <View style={styles.HeaderItems}>
        <TouchableOpacity
          style={styles.HeaderItemSM}
          onPress={() => {
            unSelectLocation();
          }}
        ></TouchableOpacity>
        <View style={styles.TitleContainer}>
          {/* <Text style={styles.TitleText}>Next Up</Text> */}
          <Text style={{ fontSize: 10 }}> </Text>
          <Image
            style={{ width: 120, height: 40 }}
            source={require("../../images/next-up_text-color.jpeg")}
          />
        </View>
        <TouchableOpacity style={styles.HeaderItemSM} />
      </View>
    </View>
  );
}

const styles = {
  HeaderContainer: {
    height: "11%",
    flexDirection: "column-reverse",
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
