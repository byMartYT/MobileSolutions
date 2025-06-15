import React from "react";
import AchievementCard from "./AchievementCard";

interface PlaceholderAchievementCardProps {
  index: number;
}

const PlaceholderAchievementCard: React.FC<PlaceholderAchievementCardProps> = ({
  index,
}) => {
  const placeholderAchievements = [
    { name: "Erster Schritt", description: "Dein erstes Todo erledigen" },
    { name: "Aufsteiger", description: "Level 5 erreichen" },
    { name: "Beständig", description: "7 Tage Streak halten" },
    { name: "Fleißig", description: "10 Skills abschließen" },
    { name: "Sammler", description: "100 Punkte sammeln" },
    { name: "Meister", description: "Level 10 erreichen" },
  ];

  const achievement =
    placeholderAchievements[index] || placeholderAchievements[0];

  return (
    <AchievementCard
      achievement={{
        id: `placeholder-${index}`,
        name: achievement.name,
        description: achievement.description,
        isUnlocked: false,
        progress: (index + 1) * 15,
      }}
      index={index}
    />
  );
};

export default PlaceholderAchievementCard;
