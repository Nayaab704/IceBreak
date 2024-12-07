import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'

interface ICustomButton {
    onPress?: () => {} | void
    text: string
    buttonStyle?: string
    textStyle?: string
}

const CustomButton = ({
    onPress,
    text,
    buttonStyle,
    textStyle
} : ICustomButton) => {

    const press = onPress ? onPress : () => console.log("Button pressed")

    return (
        <TouchableOpacity 
          className={`${buttonStyle ? buttonStyle : "bg-primary-600 border rounded-xl"}`}
          onPress={press}
          activeOpacity={0.7}
        >
          <Text className={`${textStyle ? textStyle : "text-primary font-psemibold text-lg text-center py-4"}`}>{text}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton