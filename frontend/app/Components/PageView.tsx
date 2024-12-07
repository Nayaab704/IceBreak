import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const PageView = ({
    scroll,
    children
} : {
    scroll: boolean
    children: React.ReactNode
}) => {
  return (
    <SafeAreaView className='h-screen bg-primary-default px-2'>
        {scroll ? (
            <ScrollView className='mt-5'>
                {children}
            </ScrollView>
        ) : (
            <View className='mt-5'>
                {children}
            </View>
        )}
    </SafeAreaView>
  )
}

export default PageView