import { getIntl } from "container/utils/common";
import Messages from "container/translation/Message";

export const normalRole = {
  DEPT_CREATE: {
    name: getIntl().formatMessage(Messages.create_title, {
      title: getIntl().formatMessage(Messages.department).toLowerCase(),
    }),
    value: "DEPT_CREATE",
  },
  DEPT_UPDATE: {
    name: getIntl().formatMessage(Messages.update_title, {
      title: getIntl().formatMessage(Messages.department).toLowerCase(),
    }),
    value: "DEPT_UPDATE",
  },
  DEPT_DELETE: {
    name: getIntl().formatMessage(Messages.delete_title, {
      title: getIntl().formatMessage(Messages.department).toLowerCase(),
    }),
    value: "DEPT_DELETE",
  },
  DEPT_VIEW: {
    name: getIntl().formatMessage(Messages.view_title, {
      title: getIntl().formatMessage(Messages.department).toLowerCase(),
    }),
    value: "DEPT_VIEW",
  },
  POS_CREATE: {
    name: getIntl().formatMessage(Messages.create_title, {
      title: getIntl().formatMessage(Messages.position).toLowerCase(),
    }),
    value: "POS_CREATE",
  },
  POS_UPDATE: {
    name: getIntl().formatMessage(Messages.update_title, {
      title: getIntl().formatMessage(Messages.position).toLowerCase(),
    }),
    value: "POS_UPDATE",
  },
  POS_DELETE: {
    name: getIntl().formatMessage(Messages.delete_title, {
      title: getIntl().formatMessage(Messages.position).toLowerCase(),
    }),
    value: "POS_DELETE",
  },
  POS_VIEW: {
    name: getIntl().formatMessage(Messages.view_title, {
      title: getIntl().formatMessage(Messages.position).toLowerCase(),
    }),
    value: "POS_VIEW",
  },
  MEM_CREATE: {
    name: getIntl().formatMessage(Messages.create_title, {
      title: getIntl().formatMessage(Messages.member).toLowerCase(),
    }),
    value: "MEM_CREATE",
  },
  MEM_UPDATE: {
    name: getIntl().formatMessage(Messages.update_title, {
      title: getIntl().formatMessage(Messages.member).toLowerCase(),
    }),
    value: "MEM_UPDATE",
  },
  MEM_DELETE: {
    name: getIntl().formatMessage(Messages.delete_title, {
      title: getIntl().formatMessage(Messages.member).toLowerCase(),
    }),
    value: "MEM_DELETE",
  },
  MEM_VIEW: {
    name: getIntl().formatMessage(Messages.view_title, {
      title: getIntl().formatMessage(Messages.member).toLowerCase(),
    }),
    value: "MEM_VIEW",
  },
  FUND_UPDATE: {
    name: getIntl().formatMessage(Messages.update_title, {
      title: getIntl().formatMessage(Messages.funds).toLowerCase(),
    }),
    value: "FUND_UPDATE",
  },
  FUND_VIEW: {
    name: getIntl().formatMessage(Messages.view_title, {
      title: getIntl().formatMessage(Messages.funds).toLowerCase(),
    }),
    value: "FUND_VIEW",
  },
  PROJECT_CREATE: {
    name: getIntl().formatMessage(Messages.create_title, {
      title: getIntl().formatMessage(Messages.project).toLowerCase(),
    }),
    value: "PROJECT_CREATE",
  },
  PROJECT_VIEW: {
    name: getIntl().formatMessage(Messages.view_title, {
      title: getIntl().formatMessage(Messages.project).toLowerCase(),
    }),
    value: "PROJECT_VIEW",
  },
};

export const isRoot = {
  value: "is_root",
};
