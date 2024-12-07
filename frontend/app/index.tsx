import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { Link, Redirect } from 'expo-router';
import { useGlobalContext } from './context/GlobalProvider';

export default function App() {

  const {isLoading, isLoggedIn} = useGlobalContext()

  if(!isLoading && isLoggedIn) return <Redirect href={'/home'}/>

  return (
    <View className='flex-1 items-center justify-center bg-primary-default'>
      <Text className='text-3xl font-pblack'>Log in or Sign up</Text>
      <StatusBar style="auto" />
      <Link href={"/sign-in"} className='text-black bg-primary-600 p-5 rounded-lg text-lg my-3'>Log in</Link>
      <Link href={"/sign-up"} className='text-black bg-primary-600 p-5 rounded-lg text-lg'>Sign Up</Link>
    </View>
  );
}