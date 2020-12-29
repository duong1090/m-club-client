import { atom } from "recoil";

export const currTaskState = atom({
  key: "currTaskState",
  default: {},
});

export const listTaskState = atom({
  key: "listTaskState",
  default: [
    {
      name: "Today",
    },
    {
      name: "Future",
    },
    {
      name: "Timed",
    },
    {
      name: "No time",
    },
  ],
});
