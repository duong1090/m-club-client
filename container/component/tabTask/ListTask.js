import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ExpandableListView } from 'react-native-expandable-listview';
import SearchBox from "container/component/ui/searchBox";
import {
    scale,
    color,
    fontSize,
    shadow,
    space,
    defaultText,
} from "container/variables/common";
import Avatar from "container/component/ui/avatar";
import { Icon } from "native-base";
// import { View } from "native-base";

const ListTask = (props) => {
    const { style } = props;

    const renderPriorLevel = (level) => {
        let colors = level == 1 ? color.red : level == 2 ? color.orange : color.green
        return (
            <View
                style={[styles.priorLevel, style, { backgroundColor: colors }]}>

            </View>
        )
    }

    const itemTask = (id, name, mems, priorLevel, isDone) => (
        <View style={[styles.taskContent, style]}>
            {renderPriorLevel(priorLevel)}
            <View style={[styles.taskTitle, style]}>

                <Text
                    numberOfLines={1}
                >{name}</Text>
            </View>
            {isDone ? (
                <Icon
                    type="Ionicons"
                    name="md-checkmark-circle"
                    style={{ ...defaultText, fontSize: scale(50), color: color.green }}
                />
            ) : (
                    <Icon
                        type="Ionicons"
                        name="md-checkmark-circle-outline"
                        style={{ ...defaultText, fontSize: scale(50) }}
                    />
                )}
        </View>
    )

    const memlist = [
        {
            id: '1',
            name: 'Khang 1'
        },
        {
            id: '2',
            name: 'Khang 2'
        },
        {
            id: '3',
            name: 'Khang 3'
        },
        {
            id: '4',
            name: 'Khang 4'
        },
        {
            id: '5',
            name: 'Khang 5'
        },
    ]

    const CONTENT = [
        {
            id: '1', // required, id of item
            categoryName: 'Item 1', // label of item expandable item
            isExpanded: true,
            subCategory: [
                // required, array containing inner objects
                {
                    id: '3', // required, of inner object
                    name: 'Sub Cat 1', // required, label of inner object
                    customInnerItem: itemTask("THISISIDOFITEM", 'Name of the task', memlist, 2, 0)
                },
                {
                    id: '4',
                    name: 'Sub Cat 3',
                    customInnerItem: itemTask("THISISIDOFITEM2", 'Name of the task but so long nameeeeeee ', memlist, 3, 1)
                },
                {
                    id: '33',
                    name: 'Sub Cat 3',
                    customInnerItem: itemTask("THISISIDOFITEM2", 'Name of the task but so long nameeeeeee heloooooooo ', memlist, 1, 1)
                },
                {
                    id: '43',
                    name: 'Sub Cat 3',
                },
            ],
        },
        {
            id: '2',
            categoryName: 'Item 8',
            subCategory: [{ id: '22', name: 'Sub Cat 22' }],
        },
    ];
    const selectStatus = () => {
        console.log("selectStatus")
    }
    const handleItemClick = (index) => {
        console.log(index);
    };

    const handleInnerItemClick = (innerIndex, item, itemIndex) => {
        console.log(innerIndex);
    };
    const renderFilter = () => {
        return (
            <View>

                <View style={[styles.filter, style]}>
                    <View style={[styles.itemFilter, style]}>
                        <Text style={[styles.titleFilter, style]}>Tình trạng</Text>
                        <TouchableOpacity
                            onPress={() => selectStatus()}
                        >
                            <View style={[styles.noneItem, style]}>
                                <View style={[styles.noneItem2, style]}></View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.itemFilter, style]}>
                        <Text style={[styles.titleFilter, style]}>Độ ưu tiên</Text>
                        <TouchableOpacity>
                            <View style={[styles.noneItem, style]}>
                                <View style={[styles.noneItem2, style]}></View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.itemFilter, style]}>
                        <Text style={[styles.titleFilter, style]}>Người thực hiện</Text>
                        <TouchableOpacity>
                            <View style={[styles.noneItem, style]}>
                                <View style={[styles.noneItem2, style]}></View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.itemFilter, style]}>
                        <Text style={[styles.titleFilter, style]}>Sắp xếp</Text>
                        <TouchableOpacity>
                            <View style={[styles.noneItem, style]}>
                                <View style={[styles.noneItem2, style]}></View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[styles.itemFilter, style]}>
                        <Icon
                            type="MaterialIcons"
                            name="search"
                            style={{ ...defaultText, fontSize: scale(50), color: "#077" }}
                        />
                    </TouchableOpacity>
                </View>
                <SearchBox />
                <ExpandableListView
                    // ExpandableListViewStyles={{borderTopWidth:1}} // styles to expandable listview
                    // renderInnerItemSeparator={true} // true or false, render separator between inner items
                    // renderItemSeparator={true} // true or false, render separator between Items
                    itemContainerStyle={
                        {
                            backgroundColor: '#eee',
                            borderRadius: scale(20),
                            ...shadow,
                            margin: scale(10)
                        }} // add your styles to all item container of your list
                    // itemLabelStyle={{color:'#f00'}} // add your styles to all item text of your list
                    // customChevron={{}} // your custom image to the indicator
                    // chevronColor="#faf" // color of the default indicator
                    innerItemContainerStyle={
                        {
                            // backgroundColor: "#eee",
                            marginHorizontal: scale(20),
                            marginVertical: scale(10),
                            borderRadius: scale(50),
                            // padding: scale(10),
                            // ...shadow
                        }
                    } // add your styles to all inner item containers of your list
                    // itemLabelStyle={{}} // add your styles to all inner item text of your list
                    // itemImageIndicatorStyle={{}} // add your styles to the image indicator of your list
                    animated={false} // sets all animations on/off, default on
                    // defaultLoaderStyles?: ViewStyle; // Set your styles to default loader (only for animated={true})
                    // customLoader?: JSX.Element; Pass your custom loader, while your content is measured and rendered (only for animated={true})
                    // customLoader={myLoader}
                    data={CONTENT} // required
                    onInnerItemClick={handleInnerItemClick}
                    onItemClick={handleItemClick}
                />
            </View>
        )
    }

    return (
        <View style={[styles.container, style]}>
            {renderFilter()}
        </View>
    )
}
const styles = StyleSheet.create({
    priorLevel: {
        height: '100%',
        aspectRatio: 1,
        flex: 0.07,
        backgroundColor: "#dad",
        borderRadius: scale(15),
        marginRight: scale(20)
    },
    task: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    taskContent: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: scale(20),
        alignItems: "center",
        padding: scale(10),
        paddingRight: 0,
        ...shadow
    },
    taskTitle: {
        flex: 0.9,
    },
    container: {
        backgroundColor: "#fff",
        flex: 1,
        // width: '100%',
        margin: scale(20),
        padding: scale(20),
        borderRadius: scale(20),
        alignItems: 'center',
        ...shadow,
    },
    noneItem: {
        backgroundColor: '#ddd',
        borderRadius: scale(30),
        width: '100%',
        height: scale(40),
        alignItems: 'center',
        justifyContent: 'center'
    },
    noneItem2: {
        backgroundColor: '#fff',
        borderRadius: scale(30),
        width: '30%',
        height: scale(10),
    },
    filter: {
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    itemFilter: {
        marginHorizontal: scale(6),
        backgroundColor: '#fff'
    },
    titleFilter: {
        ...defaultText,
        padding: scale(15),
        fontStyle: 'italic'
    }
});

export default ListTask;