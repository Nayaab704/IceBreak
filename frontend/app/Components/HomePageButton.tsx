import { View, Text, Image, ImageSourcePropType, Pressable } from 'react-native'
import React from 'react'
import { icons } from '../../constants'

const HomePageButton = ({
  image,
  imgAlt,
  title,
  styles,
  onPress
}: {
  image: ImageSourcePropType
  imgAlt: string,
  title: string,
  styles?: string,
  onPress?: () => void
}) => {

  const press = onPress ? onPress : () => {
    console.log(`${title} Pressed`)
  }

  return (
    <View className={`flex flex-row px-3 space-x-4 ${styles ? styles : ""}`}>
      <View className='flex-[0.3] bg-primary-600 p-4 rounded-xl row-span-1 items-center justify-center'>
        <Image
          source={image}
          resizeMode='contain'
          alt={imgAlt}
          tintColor={'black'}
        />
      </View>
      <Pressable className='bg-primary-500 rounded-xl p-2 flex-1'
        onPress={() => press()}
      >
        <View className='flex flex-row space-x-4 items-center justify-evenly w-full row-span-2'>
          <Text className='text-xl flex-1 text-center'>
            {title}
          </Text>
          
          <Pressable
              onPress={() => console.log("Options pressed")}
              className='z-10'
            >
            <View className='p-4 flex'>
              <Image
                source={icons.menu}
                alt='Menu icon'
                resizeMode='contain'
                tintColor={'black'}
              />
            </View>
          </Pressable>
        </View>
      </Pressable>
      
    </View>
  )
}

export default HomePageButton