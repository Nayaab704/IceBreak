import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Checkbox } from 'react-native-paper'

const UserSearchCard = ({
    username,
    id,
    selected,
    onPress
} : {
    username: string
    id: string
    selected: boolean
    onPress: (isChecked: boolean, id: string) => {} | void
}) => {

    const [isChecked, setIsChecked] = useState(selected)

    const clicked = (id) => {
        setIsChecked(!isChecked)
        onPress(!isChecked, id)
    }

    return (
        <View className='bg-primary-500 border-2 border-primary-600 rounded-xl px-5 py-2 mb-2 flex-row justify-between'>
            <Text className='text-lg text-center'>{username}</Text>
            <Checkbox
                status={isChecked ? 'checked' : 'unchecked'}
                onPress={() => clicked(id)}
            />
        </View>
    )
}

export default UserSearchCard