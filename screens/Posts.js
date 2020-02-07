import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
  Image,
  FlatList
} from "react-native";

import api_url from "../constants/api";
// import { AppLoading } from "expo";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right
} from "native-base";

import moment from "moment";
// import Card from "../components/Card";
export default class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: []
    };
  }
  static navigationOptions = {
    title: "Posts",
    headerStyle: {
      backgroundColor: "#f7287b"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  componentDidMount() {
    this._loadData().done();
  }

  _loadData = async () => {
    fetch(api_url.page_feed)
      .then(responce => responce.json())
      .then(res => {
        console.log(res);

        if (res) {
          this.setState({
            isLoading: false,
            dataSource: this.state.dataSource.concat(res.data)
          });
        }
      });
  };
  _keyExtractor = (datasource, index) => datasource.id.toString();

  iosTodate = date => {
    let today = moment(date).format("DD-MM-YYYY");
    return today;
  };
  render() {
    if (this.state.isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.container}
        />
      );
    } else {
      return (
        <ScrollView style={styles.container}>
          <Content>
            <FlatList
              data={this.state.dataSource}
              renderItem={({ item }) => (
                <Card>
                  <CardItem cardBody>
                    <Image
                      source={{ uri: item.full_picture }}
                      style={{
                        height: 200,
                        width: null,
                        flex: 1,
                        shadowRadius: 10
                      }}
                    />
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Text style={styles.dateStyle}>
                        Posted on : {this.iosTodate(item.created_time)}
                      </Text>
                      <Text style={{ flex: 2, marginBottom: 5 }}>
                        {item.message}
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              )}
              keyExtractor={this._keyExtractor}
            />
          </Content>
        </ScrollView>
      );
    }
  }
}

// Posts.navigationOptions = {
//   title: "Posts"
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  },
  inputContainer: {
    width: 300,
    maxWidth: "80%",
    alignItems: "center"
  },
  dateStyle: {
    marginTop: 5,
    marginBottom: 5,
    color: "#ddd"
  }
});
