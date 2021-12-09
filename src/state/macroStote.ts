import { atom } from "jotai";

export interface MacroStatus {
  [name: string]: boolean;
}

export interface MacroStoreValue {
  macroname: string;
  avaliable_macros: string[];
  isRecord: boolean;
  playingMacroStatus: MacroStatus;
  isReady: boolean;
}

export const macroAtom = atom<MacroStoreValue | undefined>(undefined);
