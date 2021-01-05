import { getIntl } from "container/utils/common";
import Messages from "container/translation/Message";

export const SEX = [
  { id: 0, title: getIntl().formatMessage(Messages.female) },
  { id: 1, title: getIntl().formatMessage(Messages.male) },
  { id: 2, title: getIntl().formatMessage(Messages.unknown) },
];

export const PRIORITY_LEVEL = [
  { id: 0, name: "Thấp" },
  { id: 1, name: "Vừa" },
  { id: 2, name: "Cao" },
];
