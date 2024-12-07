import { View, Text, Image, Pressable, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import PageView from '../Components/PageView'
import PageHeader from '../Components/PageHeader'
import { icons } from '../../constants'
import TextContainer from '../Components/TextContainer'
import { useGlobalContext } from '../context/GlobalProvider'
import { router } from 'expo-router'
import { clearAllStorageOnLogout, removeToken } from '../../lib/authTools'

const Account = () => {

  const {user} = useGlobalContext()

  const {setUser, setIsLoggedIn} = useGlobalContext()

  const logOutPressed = async () => {
    try {
      await clearAllStorageOnLogout()
      router.replace("/sign-in")
      setUser(null)
      setIsLoggedIn(false)
    } catch (error) {
      Alert.alert("Error Logging out")
    }
  }

  return (
    <PageView scroll={true}>
        <View className='w-full'>
          <PageHeader text='Account'/>
        </View>

        <Pressable 
          className='absolute right-1'
          onPress={() => console.log("Edit Button Pressed")}
        >
          <Image
            source={icons.edit}
            resizeMode='contain'
            alt='Edit icon'
            tintColor={'black'}
          />
        </Pressable>
        


        <View className='flex items-center justify-center'>       
          <View className='border-4 w-1/4 py-3 rounded-full flex items-center'>
            <Image
              source={icons.profile}
              tintColor={'black'}
              alt='Profile icon'
              resizeMode='contain'
            />
          </View>
        </View>
        <View className='flex items-center justify-center'>
          <TextContainer style='mt-5 flex w-[80%] p-4 rounded-xl' textStyle='text-xl font-psemibold text-center'>
            {user.username}
          </TextContainer>
        </View>
        <View className='flex items-center justify-center'>
          <TextContainer style='mt-5 flex w-[80%] p-4 rounded-xl' textStyle='text-lg font-pregular text-center'>
            Hello! My name is Name McName and I love this app! You should try it too!
          </TextContainer>
        </View>
        <TouchableOpacity 
          className={`bg-primary-600 border rounded-xl mt-4`}
          onPress={logOutPressed}
          activeOpacity={0.7}
        >
          <Text className={`text-primary font-psemibold text-lg text-center py-4`}>{"Log out"}</Text>
        </TouchableOpacity>
    </PageView>
  )
}

export default Account