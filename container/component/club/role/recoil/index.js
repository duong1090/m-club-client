import { atom } from "recoil";

export const currTypeState = atom({
  key: "currTypeState",
  default: null,
});

export const currItemState = atom({
  key: "currItemState",
  default: {},
});

export const currTabState = atom({
  key: "currTabState",
  default: "type_list",
});
