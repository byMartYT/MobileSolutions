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
  const { completeTask, dailyLogin, stats, fetchData, updateUserStats } =
    useGamification();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dailyLoginChecked, setDailyLoginChecked] = useState(false);

  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;

  const confettiRef = useRef(null);
  const completeConfettiRef = useRef(null);

  // Load gamification data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Check for daily login bonus - runs only once when component mounts
  useEffect(() => {
    const checkDailyLogin = async () => {
      if (!stats?.user_id || dailyLoginChecked) {
        return;
      }

      // Check if we already checked today (additional safety measure)
      const today = new Date().toDateString();
      const lastDailyCheck =
        localStorage?.getItem?.("lastDailyLoginCheck") ||
        (globalThis as any).__lastDailyLoginCheck;

      if (lastDailyCheck === today) {
        console.log("🎯 Daily login already checked today via cache");
        setDailyLoginChecked(true);
        return;
      }

      console.log("🎯 Checking daily login...");

      try {
        const result = await dailyLogin();

        // Store that we checked today
        if (localStorage?.setItem) {
          localStorage.setItem("lastDailyLoginCheck", today);
        } else {
          (globalThis as any).__lastDailyLoginCheck = today;
        }

        setDailyLoginChecked(true);
        console.log("🎯 Daily login check completed:", result);
      } catch (error) {
        console.error("🎯 Daily login check failed:", error);
        setDailyLoginChecked(true); // Still mark as checked to avoid infinite retries
      }
    };

    // Only check daily login once after stats are loaded
    if (stats?.user_id && !dailyLoginChecked) {
      checkDailyLogin();
    }
  }, [stats?.user_id, dailyLoginChecked]); // Only trigger when user_id is available and check hasn't been done

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
