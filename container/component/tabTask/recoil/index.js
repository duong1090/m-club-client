import { atom } from "recoil";
import { getIntl } from "container/utils/common";
import Messages from "container/translation/Message";

export const currTaskState = atom({
  key: "currTaskState",
  default: {},
});

export const listTaskState = atom({
  key: "listTaskState",
  default: [
    {
      name: "today",
    },
    {
      name: "future",
    },
    {
      name: "timed",
    },
    {
      name: "no_time",
    },
  ],
});

export const currModeState = atom({
  key: "currModeState",
  default: "list",
});
