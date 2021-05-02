import moment from "moment";
import { getIntl } from "container/utils/common";
import Messages from "container/translation/Message";
import Config from "container/config/server.config";
import { postRequest } from "container/utils/request";
import { stubArray } from "lodash";

const RECEIVE_FORMAT = "DD-MM-YYYY HH:mm:ss";

export const formatDateTime = (startDate, endDate) => {
  const diff = moment(endDate, RECEIVE_FORMAT).diff(
    moment(startDate, RECEIVE_FORMAT),
    "days",
    true
  );
  if (diff >= 1)
    return `${moment(startDate, RECEIVE_FORMAT).format(
      `DD/MM/YY ${getIntl().formatMessage(Messages.time_format)}`
    )} - ${moment(endDate, RECEIVE_FORMAT).format(
      `DD/MM/YY ${getIntl().formatMessage(Messages.time_format)}`
    )}`;
  else
    return `${moment(startDate, RECEIVE_FORMAT).format("DD/MM/YY")}, ${moment(
      startDate,
      RECEIVE_FORMAT
    ).format(getIntl().formatMessage(Messages.time_format))} - ${moment(
      endDate,
      RECEIVE_FORMAT
    ).format(getIntl().formatMessage(Messages.time_format))}`;
};

export const formatHumanDate = (status, startDate, endDate) => {
  // if (status == 0) return getIntl().formatMessage(Messages.happening);
  // else if (status < 60)
  //   return getIntl().formatMessage(Messages.in_minutes, {
  //     number: status,
  //   });
  // else if (status >= 60 && status <= 1440)
  //   return getIntl().formatMessage(Messages.in_hours, {
  //     number: status / 60,
  //   });
  // else if (status > 1440 && status <= 4320)
  //   return getIntl().formatMessage(Messages.on_days, {
  //     number: status / 1440,
  //   });
  // else if (status > 4320) return formatDateTime(startDate, endDate);
  if (status > 4320) {
    return formatDateTime(startDate, endDate);
  }
  else if (status > 1440) {
    return getIntl().formatMessage(Messages.on_days, {
      number: status / 1440,
    });
  } else if (status > 60) {
    return getIntl().formatMessage(Messages.in_hours, {
      number: status / 60,
    });
  } else if (status > 0) {
    return getIntl().formatMessage(Messages.in_minutes, {
      number: status,
    });
  } else {
    return getIntl().formatMessage(Messages.happening);
  }
};

export const formatPlace = (isOnline, place = null) => {
  if (isOnline) return "Online";
  else if (place) return place;
  else return "";
};

export const formatInterested = (interest, going) => {
  if (interest && going)
    return `${interest.length} ${getIntl().formatMessage(
      Messages.interested
    )}  ●  ${going.length} ${getIntl().formatMessage(Messages.going)}`;
};

export const interestEvent = (eventId, isInterested, callback) => {
  const params = {
    id: eventId,
    is_interest: isInterested ? 0 : 1,
  };
  postRequest("event/interest", params)
    .then((res) => {
      console.log(res.data);
      callback && callback(res.data);
    })
    .catch((err) => console.error(err));
};

export const goingToEvent = (eventId, isGoing, callback) => {
  const params = {
    id: eventId,
    is_participate: isGoing ? 0 : 1,
  };
  postRequest("event/participate", params)
    .then((res) => {
      console.log(res.data);
      callback && callback(res.data);
    })
    .catch((err) => console.error(err));
};
