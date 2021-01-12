import React from "react";
import { Text } from "react-native";

export const highlighText = (
  text,
  arrHighlight,
  style = {},
  arrReplace = []
) => {
  let tempText = text;
  let arrText = [];

  if (arrHighlight && arrHighlight.length) {
    arrHighlight.map((item, index) => {
      let x = `||${item}||`;
      tempText = tempText.split(`{${index}}`).join(x);
    });
    const c_split = tempText.split("||");
    c_split.map((text, j) => {
      if (j % 2 == 0) {
        arrText.push(<Text style={style}>{text}</Text>);
      } else {
        //in case replace text
        const replace_split = text.split("_");
        if (replace_split.length > 1 && arrReplace.length) {
          const index = replace_split[1];
          arrText.push(
            <Text
              style={[style, { fontWeight: "bold" }, arrReplace[index].style]}
            >
              {arrReplace[index].text}
            </Text>
          );
        } else {
          arrText.push(
            <Text style={[style, { fontWeight: "bold" }]}>{text}</Text>
          );
        }
      }
    });
  } else arrText = text;
  return arrText;
};

export const getParamsFromObj = (params) => {
  if (!params) {
    return "";
  }

  var esc = encodeURIComponent;
  var query = Object.keys(params)
    .map((k) => esc(k) + "=" + esc(params[k]))
    .join("&");
  if (query) return "&" + query;
  return "";
};

export const repairParams = (params) => {
  let newParams = params;
  Object.keys(params).map((k) => {
    if (Array.isArray(params[k])) {
      params[k].map((item, index) => (newParams[`${k}[${index}]`] = item));
      delete newParams[k];
    }
  });
  return getParamsFromObj(newParams);
};
