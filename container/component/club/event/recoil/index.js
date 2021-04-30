import { atom } from "recoil";

export const currEventState = atom({
  key: "currEventState",
  default: {},
});

export const listEventState = atom({
  key: "listEventState",
  default: [],
});

export const modeState = atom({
  key: "modeState",
  default: "list",
});
