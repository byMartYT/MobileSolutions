import { FlatList, Text, View } from "react-native";
import React, { Component, useRef } from "react";
import Container from "@/components/Container";
import { Confetti } from "react-native-fast-confetti";
import useStore from "@/store/store";
import ListSkillItem from "@/components/ListSkillItem";

const list = () => {
  const confettiRef = useRef(null);
  const { skills, setSkills } = useStore();
  return (
    <Container isHeaderShown={true}>
      <Confetti
        autoplay={false}
        isInfinite={false}
        fadeOutOnEnd={true}
        ref={confettiRef}
      />
      <FlatList
        data={skills}
        renderItem={({ item }) => <ListSkillItem {...item} />}
        keyExtractor={(item) => item.id!}
        contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      />
    </Container>
  );
};

export default list;
