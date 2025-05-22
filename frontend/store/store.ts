import { Todo } from "@/generated";
import { create } from "zustand";

type SkillState = {
  skills: Todo[];
  setSkills: (skills: Todo[]) => void;
  addSkill: (skill: Todo) => void;
  updateSkill: (skill: Todo) => void;
  user: string;
};

const useStore = create<SkillState>((set) => ({
  skills: [],
  setSkills: (skills) => set({ skills }),
  addSkill: (skill) =>
    set((state) => ({
      skills: [...state.skills, skill],
    })),
  user: "",
  updateSkill: (skill: Todo) =>
    set((state) => ({
      skills: state.skills.map((s) => (s.id === skill.id ? skill : s)),
    })),
}));

export default useStore;
