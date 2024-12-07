import { View, Text, Switch } from 'react-native'
import React, { useState } from 'react'
import PageView from '../Components/PageView'
import PageHeader from '../Components/PageHeader'
import TextContainer from '../Components/TextContainer'

const Settings = () => {

  const [buttonTappingToggle, setButtonTappingToggle] = useState(false)

  const toggleButtonTapping = () => {
    setButtonTappingToggle(!buttonTappingToggle)
    console.log("Button Tapping Pressed: ", !buttonTappingToggle)
  }

  return (
    <PageView scroll={true}>
      <PageHeader text='Settings'/>
      <View className='flex justify-center items-center mb-5'>
        <TextContainer style='w-[70%] flex justify-center items-center p-5 rounded-xl' textStyle='text-lg font-bold' onPress={() => console.log("Font Size Pressed")}>
          Font Size
        </TextContainer>
      </View>
      <View className='flex justify-center items-center mb-5'>
        <TextContainer style='w-[70%] flex justify-center items-center p-5 rounded-xl' textStyle='text-lg font-bold' onPress={() => console.log("Customize Colors Pressed")}>
          Customize Colors
        </TextContainer>
      </View>
      <View className='flex justify-center items-center mb-5'>
        <TextContainer style='w-[70%] flex justify-center items-center p-5 rounded-xl' textStyle='text-lg font-bold'>
          Button Tapping
        </TextContainer>
        <Switch
          className='absolute right-0 scale-125'
          onValueChange={toggleButtonTapping}
          value={buttonTappingToggle}
        />
      </View>
    </PageView>
  )
}

export default Settings