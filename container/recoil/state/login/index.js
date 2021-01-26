import { atom } from "recoil";

export const clubListState = atom({
  key: "clubListState",
  default: [],
});

export const certificateState = atom({
  key: "certificateState",
  default: {},
});

export const activeTabState = atom({
  key: "activeTabState",
  default: 0,
});
