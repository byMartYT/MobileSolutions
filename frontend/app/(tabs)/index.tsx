import React from "react";
import Title from "@/components/Title";
import useStore from "@/store/store";
import SkillItem from "@/components/SkillItem";
import Container from "@/components/Container";
import { FlatList, View } from "react-native";

export default function Index() {
  const { skills } = useStore();

  return (
    <Container>
      <FlatList
        data={skills}
        ListHeaderComponent={
          <View style={{ paddingTop: 20 }}>
            <Title className="">Deine Lernziele</Title>
          </View>
        }
        renderItem={({ item }) => <SkillItem {...item} />}
        keyExtractor={(item) => item.id!}
        contentContainerStyle={{ gap: 40, paddingBottom: 20 }}
      />
    </Container>
  );
}
