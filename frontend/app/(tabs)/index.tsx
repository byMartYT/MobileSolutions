import React, { useEffect, useRef, useState } from "react";
import Title from "@/components/Title";
import useStore from "@/store/store";
import SkillItem from "@/components/SkillItem";
import Container from "@/components/Container";
import { useGamification } from "@/store/gamificationStore";
import {
  FlatList,
  View,
  RefreshControl,
  Pressable,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import { Confetti } from "react-native-fast-confetti";
import { api } from "@/api/api";
import { Plus, X } from "lucide-react-native";
import { router } from "expo-router";
import AddChooseModal from "@/components/AddChooseModal";

export default function Index() {
  const { skills, removeSkill, setSkills } = useStore();
  const { completeTask, awardPoints, stats, fetchData, updateUserStats } =
    useGamification();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;

  const confettiRef = useRef(null);
  const completeConfettiRef = useRef(null);

  // Load gamification data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Check for daily login bonus - runs when stats change
  useEffect(() => {
    const checkDailyLogin = async () => {
      if (!stats?.user_id) {
        return;
      }

      if (stats?.last_active_date) {
        const today = new Date();
        const lastActive = new Date(stats.last_active_date);

        // Check if it's actually a different day (not just a different time)
        const todayDateString = today.toDateString();
        const lastActiveDateString = lastActive.toDateString();

        // Award daily login bonus only if it's actually a new day
        if (todayDateString !== lastActiveDateString) {
          try {
            // Award daily login points (this now automatically updates streak in backend)
            await awardPoints("daily_login");
          } catch (error) {
            console.error("🎯 Daily login bonus failed:", error);
          }
        } else {
        }
      } else {
        try {
          // First time login (this now automatically updates streak in backend)
          await awardPoints("daily_login");
        } catch (error) {
          console.error("🎯 First time login bonus failed:", error);
        }
      }
    };

    // Only run if we have stats and they contain an actual last_active_date
    if (stats?.user_id && stats?.last_active_date !== undefined) {
      checkDailyLogin();
    }
  }, [stats?.last_active_date]); // Trigger when last_active_date changes

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

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("window").height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
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
            <View className="flex-row items-center justify-between mb-4">
              <Title className="">Deine Lernziele</Title>
              <Pressable
                onPress={openModal}
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Plus size={24} color="black" strokeWidth={2} />
              </Pressable>
            </View>
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
      <AddChooseModal
        closeModal={closeModal}
        modalVisible={modalVisible}
        slideAnim={slideAnim}
      />
    </Container>
  );
}
