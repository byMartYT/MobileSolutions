import React, { useEffect, useRef, useState } from "react";
import Title from "@/components/Title";
import useStore from "@/store/store";
import SkillItem from "@/components/SkillItem";
import Container from "@/components/Container";
import { FlatList, View, RefreshControl } from "react-native";
import { Confetti } from "react-native-fast-confetti";
import { api } from "@/api/api";

export default function Index() {
  const { skills, removeSkill, setSkills } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const confettiRef = useRef(null);
  const completeConfettiRef = useRef(null);

  const handleConfetti = () => {
    if (confettiRef.current) {
      // @ts-ignore
      confettiRef.current.restart();
    }
  };
  const completeConfetti = () => {
    if (completeConfettiRef.current) {
      // @ts-ignore
      completeConfettiRef.current.restart();
    }
  };

  const handleRemoveSkill = async (id: string) => {
    removeSkill(id);
    await api.deleteTodoApiV1TodosTodoIdDelete(id);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await api.getTodosApiV1TodosGet();
      setSkills(data.data);
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Skills:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Container>
      <Confetti
        autoplay={false}
        isInfinite={false}
        fadeOutOnEnd={true}
        ref={confettiRef}
      />
      <Confetti
        autoplay={false}
        isInfinite={false}
        fadeOutOnEnd={true}
        ref={completeConfettiRef}
        count={400}
      />
      <FlatList
        data={skills}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="black" // Farbe des Refresh-Indikators (iOS)
            colors={["#C0B0FF"]} // Farben des Refresh-Indikators (Android)
          />
        }
        ListHeaderComponent={
          <View style={{ paddingTop: 20 }}>
            <Title className="">Deine Lernziele</Title>
          </View>
        }
        renderItem={({ item }) => (
          <SkillItem
            handleConfetti={handleConfetti}
            completeConfetti={completeConfetti}
            removeSkill={handleRemoveSkill}
            {...item}
          />
        )}
        keyExtractor={(item) => item.id!}
        contentContainerStyle={{ gap: 40, paddingBottom: 20 }}
      />
    </Container>
  );
}
