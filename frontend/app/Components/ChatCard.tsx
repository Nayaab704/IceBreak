import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, Router } from 'expo-router'

const ChatCard = ({
    name,
    groupId
} : {
    name: string
    groupId: string
}) => {

  const chatCardPressed = () => {
    router.push(`/chatGroup/${groupId}`)
  }

  return (
    <TouchableOpacity onPress={chatCardPressed}>
      <View className='bg-primary-500 border rounded-xl px-3 py-2 mb-1 flex-row justify-between'>
        <Text>{name}</Text>
        <Text className='absolute text-xs bottom-0 right-0 mr-1'>Date of last message</Text>
      </View>
    </TouchableOpacity>
  )
}

export default ChatCard