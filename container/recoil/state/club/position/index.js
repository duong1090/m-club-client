import { atom } from "recoil";

export const currPositionState = atom({
  key: "currPositionState", default: {},
});

export const listPositionState = atom({
  key: "listPositionState",
  default: [],
});
