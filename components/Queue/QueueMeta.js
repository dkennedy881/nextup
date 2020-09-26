import React, { useState, useEffect, Component } from "react";

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";

function QueueMeta({ queueData, userObj, editing, updateQueueMeta }) {
  const [title, setTitle] = useState(queueData.title);
  const [message, setMessage] = useState(queueData.message);
  const [open, setOpen] = useState(queueData.hours.open);
  const [close, setClose] = useState(queueData.hours.close);
  const [id, setId] = useState(queueData.id);
  const [count, setCount] = useState(queueData.count);
  const [active, setactive] = useState(queueData.active);
  const [address, setAddress] = useState(queueData.address);
  const [zipCode, setZipCode] = useState(queueData.zipCode);

  function update() {
    updateQueueMeta({
      id,
      title,
      message,
      hours: {
        open,
        close,
      },
      count,
      active,
      address,
      zipCode,
    });
  }

  if (editing) {
    return (
      <KeyboardAvoidingView
        enabled
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
        behavior="padding"
      >
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.MetaContainer}>
              <View style={styles.MetaRow}>
                <Text style={styles.MetaTitleText}>Update Business Status</Text>
                <Text style={styles.MetaTitleTextSM}>
                  keep your prospective customers informed
                </Text>
                <TextInput
                  style={styles.MetaDataParagraphInput}
                  defaultValue={message}
                  multiline
                  numberOfLines={4}
                  onChangeText={(value) => setMessage(value)}
                ></TextInput>
              </View>
              <View style={styles.ButtonRow}>
                <TouchableOpacity
                  style={styles.SaveButton}
                  onPress={() => update()}
                >
                  <Text style={styles.SaveButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  borderBottomColor: "#ccc",
                  borderBottomWidth: 1,
                }}
              />
              <View style={styles.MetaRow}>
                <Text style={styles.MetaTitleText}>Business Name</Text>
                <Text style={styles.MetaTitleTextSM}>
                  The name customers will see when using the app
                </Text>
                <TextInput
                  style={styles.MetaDataTextInput}
                  defaultValue={title}
                  onChangeText={(value) => setTitle(value)}
                ></TextInput>
              </View>
              <View style={styles.MetaRow}>
                <Text style={styles.MetaTitleText}>Hours</Text>
                <Text style={styles.MetaDataText}>Open</Text>
                <TextInput
                  style={styles.MetaDataTextInput}
                  defaultValue={open}
                  onChangeText={(value) => setOpen(value)}
                ></TextInput>
                <Text style={styles.MetaDataText}>Close</Text>
                <TextInput
                  style={styles.MetaDataTextInput}
                  defaultValue={close}
                  onChangeText={(value) => setClose(value)}
                ></TextInput>
              </View>

              <View style={styles.MetaRow}>
                <Text style={styles.MetaTitleText}>Address</Text>
                <TextInput
                  style={styles.MetaDataTextInput}
                  defaultValue={address}
                  onChangeText={(value) => setAddress(value)}
                ></TextInput>
              </View>

              <View style={styles.MetaRow}>
                <Text style={styles.MetaTitleText}>Zip Code</Text>
                <TextInput
                  style={styles.MetaDataTextInput}
                  defaultValue={zipCode}
                  onChangeText={(value) => setZipCode(value)}
                ></TextInput>
              </View>

              <View style={styles.ButtonRow}>
                <TouchableOpacity
                  style={styles.SaveButton}
                  onPress={() => update()}
                >
                  <Text style={styles.SaveButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  } else {
    return (
      <View style={styles.MetaContainer}>
        <View style={styles.MetaRow}>
          <Text style={styles.MetaTitleText}>{queueData.title}</Text>
          <Text style={styles.MetaData}>{queueData.message}</Text>
        </View>
        <View style={styles.MetaRow}>
          <Text style={styles.MetaTitleText}>Hours</Text>
          <Text style={styles.MetaDataText}>
            {queueData.hours.open} - {queueData.hours.close}
          </Text>
        </View>
      </View>
    );
  }
}

export default QueueMeta;

const styles = StyleSheet.create({
  MetaContainer: {
    paddingTop: 50,
    // flex: 1,
    overflow: "scroll",
    justifyContent: "flex-end",
  },
  MetaRow: {
    margin: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  ButtonRow: {
    flexDirection: "row-reverse",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  SaveButton: {
    backgroundColor: "lightgreen",
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9,
  },
  SaveButtonText: {
    fontWeight: "700",
  },
  MetaTitleText: {
    fontWeight: "700",
    marginTop: 1,
    marginBottom: 1,
  },
  MetaTitleTextSM: {
    fontWeight: "300",
    marginTop: 5,
    marginBottom: 5,
  },
  MetaDataText: {
    marginTop: 5,
    marginBottom: 5,
  },
  MetaDataTextInput: {
    borderStyle: "solid",
    borderColor: "#ccc",
    borderWidth: 1,
    height: 50,
    borderRadius: 9,
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
  },
  MetaDataParagraphInput: {
    borderStyle: "solid",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 9,
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
    minHeight: 100,
    textAlign: "left",
  },
});
