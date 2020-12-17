
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
    scale,
    color,
    fontSize,
    shadow,
    space,
    defaultText,
} from "container/variables/common";
import Avatar from "container/component/ui/avatar";
// import { View } from "native-base";

const HeaderInfo = (props) => {
    const { style } = props;

    return (
        <View style={[styles.container, style]}>
            <View style={styles.info}>
                <Text style={styles.name}>Lê Đức Khang</Text>
                <Text style={styles.position}>Trưởng ban truyền thông</Text>
            </View>
            <Avatar size={scale(100)} />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        width:'100%',
        flexDirection: "row",
        padding: space.bgPadding,
        borderBottomRightRadius: scale(20),
        borderBottomLeftRadius: scale(20),
        alignItems: 'center',
        justifyContent: 'flex-end',
        ...shadow,
    },
    info: {
        marginLeft: scale(40),
        alignItems: 'flex-end',
        padding: scale(10)
    },
    name: {
        ...defaultText,
        fontSize: fontSize.size36,
        fontWeight: "bold",
    },
    position: {
        ...defaultText,
        fontSize: fontSize.sizeBigContent,
        fontStyle: 'italic'
    },
});

export default HeaderInfo;
