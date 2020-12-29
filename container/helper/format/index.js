import React from "react";
import { Text } from "react-native";

export const highlighText = (text, arrHighlight, style) => {
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
        arrText.push(
          <Text style={[style, { fontWeight: "bold" }]}>{text}</Text>
        );
      }
    });
  } else arrText = text;
  return arrText;
};
