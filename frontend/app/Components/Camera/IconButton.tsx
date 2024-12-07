import {Ionicons} from "@expo/vector-icons"
import { ComponentProps } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native";

const CONTAINER_PADDING = 5
const CONTAINER_WIDTH = 34
const ICON_SIZE = 25

interface IconButtonProps {
    iconName: ComponentProps<typeof Ionicons>['name']
    containerStyles?: StyleProp<ViewStyle>
    onPress?: () => void
    width?: number
    height?: number
    size?: number
}

export default function IconButton({
    iconName,
    containerStyles,
    onPress,
    width,
    height,
    size
}: IconButtonProps) {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[{
                backgroundColor: "#00000050",
                padding: CONTAINER_PADDING,
                borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2),
                // width: CONTAINER_WIDTH
            }, containerStyles]}
        >
            <Ionicons 
                size={size ? size : ICON_SIZE}
                name={iconName}
                color={"white"}
            />
        </TouchableOpacity>
    )
}