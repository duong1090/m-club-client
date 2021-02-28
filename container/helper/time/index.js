import moment from "moment";
import { getIntl } from "container/utils/common";
import Messages from "container/translation/Message";

global.REFERENCE = moment(); // fixed just for testing, use moment();
global.TODAY = global.REFERENCE.clone().startOf("day");
global.YESTERDAY = global.REFERENCE.clone().subtract(1, "days").startOf("day");
// const A_WEEK_OLD = REFERENCE.clone().subtract(7, 'days').startOf('day');
global.A_WEEK_OLD = global.REFERENCE.clone().startOf("isoweek");

export function resetReferenceDate() {
  global.REFERENCE = moment(); // fixed just for testing, use moment();
  global.TODAY = global.REFERENCE.clone().startOf("day");
  global.YESTERDAY = global.REFERENCE.clone()
    .subtract(1, "days")
    .startOf("day");
  // const A_WEEK_OLD = REFERENCE.clone().subtract(7, 'days').startOf('day');
  global.A_WEEK_OLD = global.REFERENCE.clone().startOf("isoweek");
}

export function formatDate(time) {
  // const timeStamp = moment(time).unix();
  // const week =
  // return moment(time).fromNow()
  let momentDate = moment(time);
  if (isToday(momentDate)) {
    return momentDate.format("LT");
  } else if (isYesterday(momentDate)) {
    return getIntl().formatMessage(Messages.yesterday);
  } else if (isWithinAWeek(momentDate)) {
    return momentDate.format("dddd");
  }
  return momentDate.format("l");
}

export function isToday(momentDate) {
  return momentDate.isSame(global.TODAY, "d");
}

export function isYesterday(momentDate) {
  return momentDate.isSame(global.YESTERDAY, "d");
}

export function isWithinAWeek(momentDate) {
  return momentDate.isAfter(global.A_WEEK_OLD);
}

export function getHumanDay(time, format) {
  let momentDate = format ? moment(time, format) : moment(time);
  if (isToday(momentDate)) {
    return momentDate.format(getIntl().formatMessage(Messages.format_today));
  } else if (isYesterday(momentDate)) {
    return momentDate.format(
      getIntl().formatMessage(Messages.format_yesterday)
    );
  } else if (isWithinAWeek(momentDate)) {
    return momentDate.format("dddd");
  }
  return momentDate.format(
    `${getIntl().formatMessage(Messages.date_short_format)} HH:mm`
  );
}
