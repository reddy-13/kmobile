import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from "react-native";
import { blue } from "ansi-colors";
import { Form, Item, Input, Label, Button } from "native-base";
import * as Facebook from "expo-facebook";
import api_url from "../constants/api";
// import AsyncStorage from "@react-native-community/async-storage";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

const FB_APP_ID = "1688694837933499";
export default class Login extends React.Component {
  static navigationOptions = {
    title: "Loading",
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      userId: "",

      email: "",
      password: "",
      isLoading: false
    };
  }

  componentDidMount() {
    this.getData();
  }

  singInUser = async () => {
    // Alert.alert(this.state.username + "-- " + this.state.password);
    this.setState({ isLoading: true });
    fetch(api_url.url + "userCtrl/login", {
      method: "POST",
      headers: {
        Accept: "applicaton/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(responce => responce.json())
      .then(res => {
        if (res.status === "success") {
          this.setState({ isLoading: false });
          var user_id = res.user_id;
          var username = res.name;
          console.log(res);
          AsyncStorage.setItem("user_id", user_id);
          AsyncStorage.setItem("username", username);

          this.props.navigation.navigate("Main", { username: username });
        } else {
          alert(res.msg);
        }
      });
  };

  getData = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      const user_id = await AsyncStorage.getItem("user_id");
      if (username !== null) {
        // value previously stored

        if (this.state.username !== "") {
          this.props.navigation.navigate("Main", { username: username });
        }
      }
    } catch (e) {
      // error reading value
    }
  };
  // LoginFB = async () => {
  //   try {
  //     const {
  //       type,
  //       token,
  //       expires,
  //       permissions,
  //       declinedPermissions
  //     } = await Facebook.logInWithReadPermissionsAsync(FB_APP_ID, {
  //       permissions: ["public_profile"]
  //     });
  //     if (type === "success") {
  //       // Get the user's name using Facebook's Graph API
  //       const response = await fetch(
  //         `https://graph.facebook.com/me?access_token=${token}`
  //       );
  //       let data = await response.json();
  //       // Alert.alert("Logged in!", `Hi ${(await response.json()).name}!`);
  //       if (data.id) {
  //         this.setState({ userId: data.id });
  //         if (this.state.userId) {
  //           await AsyncStorage.setItem("fb_id", this.state.userId);
  //           await AsyncStorage.setItem("email_id", data.email);
  //           this.props.navigation.navigate("Main");
  //         }
  //       }
  //       console.log(data.id);
  //     } else {
  //       // type === 'cancel'
  //     }
  //   } catch ({ message }) {
  //     alert(`Facebook Login Error: ${message}`);
  //   }
  // };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.progress}>
          <ActivityIndicator size="large" color="#01CBC6" />
        </View>
      );
    }
    return (
      <KeyboardAvoidingView behavior="position" enabled>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/images/robot-dev.png")} />
          <Text>Kharagpur Mobile Media</Text>
        </View>
        <Form style={styles.form}>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={email => this.setState({ email })}
            />
          </Item>

          <Item floatingLabel>
            <Label>Pasword</Label>
            <Input
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={password => this.setState({ password })}
            />
          </Item>
          <Button
            style={styles.button}
            full
            rounded
            onPress={() => {
              this.singInUser(this.state.email, this.state.password);
            }}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </Button>
        </Form>
        {/* <View style={styles.footer}>
          <Text>OR</Text>
          <Button
            style={styles.button}
            full
            rounded
            onPress={() => {
              this.LoginFB();
            }}
          >
            <Text style={styles.buttonText}>Login with Facebook</Text>
          </Button>
        </View> */}
      </KeyboardAvoidingView>
    );
  }
}

Login.navigationOptions = {
  title: "Login"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: 50
  },
  form: {
    padding: 20,
    width: "100%",
    marginBottom: 30
  },
  button: {
    marginTop: 20
  },
  buttonText: {
    color: "#fff"
  },
  footer: {
    alignItems: "center"
  }
});
