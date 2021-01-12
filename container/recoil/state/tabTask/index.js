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
      name: getIntl().formatMessage(Messages.today),
    },
    {
      name: getIntl().formatMessage(Messages.future),
    },
    {
      name: getIntl().formatMessage(Messages.timed),
    },
    {
      name: getIntl().formatMessage(Messages.no_time),
    },
  ],
});
