import { View, Text } from 'react-native'
import React from 'react'

const PageHeader = ({
    text
} : {
    text: string
}) => {
  return (
    <View className='items-center justify-center mb-10'>
        <Text className='font-pbold text-3xl mb-2'>
            {text}
        </Text>
        <View className='w-1/2 bg-primary-600 h-2' />
    </View>
  )
}

export default PageHeader