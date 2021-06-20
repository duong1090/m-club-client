import { atom } from "recoil";

export const currMemberState = atom({
  key: "currMemberState",
  default: {},
});

export const listMemberState = atom({
  key: "listMemberState",
  default: [],
});

export const currModeState = atom({
  key: "currModeState",
  default: "list",
});
