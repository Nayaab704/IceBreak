import { View, Text, Pressable } from 'react-native'
import React from 'react'

const TextContainer = ({
    children,
    style,
    textStyle,
    onPress
} : {
    children: React.ReactNode
    style?: string
    textStyle?: string
    onPress?: () => void
}) => {

  if(onPress) {
    return (
      <Pressable onPress={() => onPress()} className={`w-full justify-center items-center`}>
        <View className={`bg-primary-500 ${style ? style : ""}`}>
            <Text className={textStyle ? textStyle : ""}>
              {children}
            </Text>
        </View>
      </Pressable>
    )
  } else {
    return (
      <View className={`bg-primary-500 ${style ? style : ""}`}>
          <Text className={textStyle ? textStyle : ""}>
            {children}
          </Text>
      </View>
    )
  }
  
}

export default TextContainer