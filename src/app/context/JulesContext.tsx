import { createContext, useContext } from "react";

export type JulesContextValue = {
  isDark: boolean;
  onToggleDark: () => void;
  likedCards: Set<string>;
  onLikedCardsChange: (updater: (prev: Set<string>) => Set<string>) => void;
};

export const JulesContext = createContext<JulesContextValue | null>(null);

export function useJulesContext(): JulesContextValue {
  const ctx = useContext(JulesContext);
  if (!ctx) throw new Error("useJulesContext must be used within JulesContext.Provider");
  return ctx;
}
