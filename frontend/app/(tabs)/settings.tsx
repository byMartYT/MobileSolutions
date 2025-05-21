import { Text } from "react-native";
import React, { Component } from "react";
import Container from "@/components/Container";
import { useNavigation } from "expo-router";

export class settings extends Component {
  render() {
    return (
      <Container isHeaderShown={true}>
        <Text>settings</Text>
      </Container>
    );
  }
}

export default settings;
