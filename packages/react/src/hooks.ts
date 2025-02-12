import { useContext } from "react";
import { VoerkaI18nContext } from "./context";

export function useVoerkaI18n() {
    return useContext(VoerkaI18nContext) 
} 