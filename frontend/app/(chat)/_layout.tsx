import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

function ChatLayout() {
    return (
        <>
          <Stack>
            <Stack.Screen
              name='chatGroup/[groupId]'
              options={{
                headerShown: true,
                headerTitle: 'Chat',
                headerStyle: {
                    backgroundColor: "#23BAE5",
                },
              }}
              
            />
          </Stack>
          <StatusBar backgroundColor='#161622' style='light'/>
        </>
      )
}

export default ChatLayout