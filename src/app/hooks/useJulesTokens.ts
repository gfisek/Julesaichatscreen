import { useMemo } from "react";
import { useJulesContext } from "../context/JulesContext";

/**
 * Tüm chat/panel bileşenlerinde tekrar eden tema token hesaplamalarını
 * tek bir yerde toplar. isDark değiştiğinde useMemo ile yeniden hesaplanır.
 *
 * Kullanım:
 *   const { textPrimary, accentColor, border, isDark, ... } = useJulesTokens();
 */
export function useJulesTokens() {
  const { isDark } = useJulesContext();

  return useMemo(() => ({
    isDark,

    // Metin renkleri
    textPrimary:    isDark ? "#cfe8f4" : "#111827",
    textSecondary:  isDark ? "#6fa8bf" : "#6b7280",
    textMuted:      isDark ? "#3d7089" : "#9ca3af",

    // Mesaj balonları
    userBubble:     isDark ? "#1a3247" : "#F2F2F3",
    userBubbleText: isDark ? "#cfe8f4" : "#374151",

    // Vurgu renkleri
    accentColor:    isDark ? "var(--jules-accent-light)" : "var(--jules-secondary)",
    accentDimBg:    isDark ? "rgba(77,196,206,0.10)" : "var(--jules-accent-bg)",
    accentDimBdr:   isDark ? "rgba(77,196,206,0.25)" : "#62b8c8",

    // Sınır & arka plan
    border:         isDark ? "#1d3547" : "#e5e7eb",
    inputBg:        isDark ? "#132230" : "#f9fafb",
    bgSticky:       isDark ? "#1a3247" : "#F2F2F3",
    bgHeader:       isDark ? "rgba(14, 31, 44, 0.55)" : "rgba(255, 255, 255, 0.55)",
  }), [isDark]);
}
