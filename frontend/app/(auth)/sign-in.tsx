import { View, Text, TextInput, KeyboardAvoidingView, Platform, Button, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { login } from '../../api/authApi'
import { storeToken, validateEmail, validatePassword } from '../../lib/authTools'
import { useGlobalContext } from '../context/GlobalProvider'
import { Link, router } from 'expo-router'
import CustomButton from '../Components/CustomButton'

interface ISignInForm {
  email: string
  password: string
}

const SignIn = () => {
  const {setUser} = useGlobalContext()

  const [forms, setForms] = useState<ISignInForm>({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const signInPressed = async () => {
    const {email, password} = forms
    setIsLoading(true)
    try {
      if(!validateEmail(email)){
        throw new Error("Invalid email.")
      }
      
      const user = await login(email, password)
      await storeToken(user.token)
      setUser({id: user.id, username: user.username})
      router.replace('/home')
    } catch (error) {
      console.log("Error in sign-in: ", error)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <SafeAreaView className='flex-1 justify-center items-center h-full bg-primary-default'>
      <View>
        <TextInput
          className='p-3 border-2 rounded-xl border-primary-600 mb-3'
          value={forms.email}
          onChangeText={text => setForms({... forms, email: text})}
          autoCorrect={false}
          placeholder='Enter your email.'
          inputMode='email'
        />
        <TextInput
          className='p-3 border-2 rounded-xl border-primary-600 mb-3'
          value={forms.password}
          onChangeText={text => setForms({... forms, password: text})}
          autoCorrect={false}
          placeholder='Enter your password.'
          secureTextEntry={true}
        />
        <CustomButton
          text='Sign In'
          onPress={signInPressed}
        />
        <View className='justify-center pt-5 flex-row gap-2'>
          <Text className='text-lg '>Don't have an account?</Text>
          <Link href={"sign-up"} className='text-lg font-psemibold text-primary-600'>Sign Up</Link>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SignIn