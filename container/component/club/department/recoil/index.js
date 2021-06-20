import { atom } from "recoil";

export const currDepartmentState = atom({
  key: "currDepartmentState",
  default: {},
});

export const listDepartmentState = atom({
  key: "listDepartmentState",
  default: [],
});

export const currModeState = atom({
  key: "currModeState",
  default: "list",
});
