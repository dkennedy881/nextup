import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Axios from "axios";

//comps
import HeaderContainer from "./components/Header/HeaderContainer";
import QueueList from "./components/Queue/QueuesList";
//containers
import SignUpContainer from "./components/SignUp/SignUpContainer";
import LogInContainer from "./components/LogIn/LogInContainer";

export default class App extends Component {
  state = {
    isLoggedIn: false,
    isSignedUp: true,
    userObj: false,
    queueData: false,
    showSettings: false,
  };

  toggleSettings = () => {
    this.setState({ showSettings: !this.state.showSettings });
  };

  toggleLogIn = async (phoneNumber, password) => {
    let { isLoggedIn, userObj, queueData } = this.state;

    if (isLoggedIn) {
      await this.setState((state) => ({
        ...state,
        userObj: false,
        queueData: false,
        isLoggedIn: !isLoggedIn,
        isSignedUp: true,
        showSettings: false,
      }));
    } else {
      //1. use params for log in
      try {
        userObj = await this.logIn(phoneNumber, password);
      } catch (e) {
        alert(e);
        return;
      }
      await this.setState((state) => ({
        ...state,
        userObj,
        isLoggedIn: !isLoggedIn,
      }));

      try {
        queueData = await this.getQueueData(userObj.id["$numberLong"]);
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
        queueData = newJSON;
      } catch (e) {
        alert("No User Queue Found");
        return;
      }
      // return;
      await this.setState((state) => ({
        ...state,
        queueData,
      }));
    }
  };

  logIn = (phoneNumber, password) => {
    return new Promise(async (res, rej) => {
      try {
        let { data } = await Axios.post(
          "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/nextup-ssnrm/service/logInQueueManager/incoming_webhook/webhook0",
          {
            phoneNumber: String(phoneNumber),
            password: String(password),
          }
        );
        if (data) {
          res(data);
        } else {
          rej("User Not Found");
        }
      } catch (e) {
        alert(e);
      }
    });
  };

  getQueueData = async (id) => {
    //temp
    return new Promise(async (res, rej) => {
      try {
        let { data } = await Axios.post(
          "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/nextup-ssnrm/service/getUserQueue/incoming_webhook/webhook0",
          {
            id: parseInt(id),
          }
        );
        if (data) {
          res(data);
        } else {
          rej("User Not Found");
        }
      } catch (e) {
        alert(e);
      }
    });
  };

  updateUserQueue = ({
    title,
    message,
    hours,
    count,
    active,
    id,
    address,
    zipCode,
  }) => {
    return new Promise(async (res, rej) => {
      try {
        let { data: queueData } = await Axios.post(
          "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/nextup-ssnrm/service/updateUserQueue/incoming_webhook/webhook0",
          {
            title: title,
            message: message,
            open: hours.open,
            close: hours.close,
            count: parseInt(count),
            active: active,
            id: parseInt(id),
            address: address,
            zipCode: zipCode,
          }
        );
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
        queueData = newJSON;

        await this.setState({
          queueData: queueData,
        });
        res(queueData);
      } catch (e) {
        alert(e);
      }
    });
  };

  toggleLogInSignUp = () => {
    this.setState({ isSignedUp: !this.state.isSignedUp });
  };

  render() {
    return (
      <View style={styles.loggedInContainer}>
        <QueueList />
      </View>
    );
  }
}
function DisplayLogInSignUp({ isSignedUp, toggleLogIn, toggleLogInSignUp }) {
  return (
    <View style={styles.loginSignUpContainer}>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Image
          style={{
            height: 100,
            flex: 1,
            alignSelf: "stretch",
          }}
          source={require("./images/next-up_text-color.jpeg")}
        />
      </View>
      {isSignedUp ? (
        <LogInContainer
          queueMember={false}
          toggleLogIn={toggleLogIn}
          toggleLogInSignUp={toggleLogInSignUp}
        />
      ) : (
        <SignUpContainer
          queueMember={false}
          toggleLogInSignUp={toggleLogInSignUp}
          toggleLogIn={toggleLogIn}
        ></SignUpContainer>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loginSignUpContainer: {
    margin: 20,
    alignContent: "center",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loggedInContainer: {
    flex: 1,
  },
});
