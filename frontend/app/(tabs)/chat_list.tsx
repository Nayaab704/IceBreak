import { Modal, TextInput, View, Text, FlatList, GestureResponderEvent, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import PageView from '../Components/PageView'
import PageHeader from '../Components/PageHeader'
import CustomButton from '../Components/CustomButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createGroup, getUserGroups, searchUsers } from '../../api/chatApi'
import { ActivityIndicator, Checkbox } from 'react-native-paper'
import UserSearchCard from '../Components/UserSearchCard'
import { useGlobalContext } from '../context/GlobalProvider'
import ChatCard from '../Components/ChatCard'
import socket from '../../api/socket'

interface IFoundUser {
  id: string
  username: string
}

const ChatList = () => {

  const {user} = useGlobalContext()

  const [isLoading, setIsLoading] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchField, setSearchField] = useState("")
  const [groupName, setGroupName] = useState("")
  const [foundUsers, setFoundUsers] = useState<IFoundUser[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [usersGroups, setUsersGroups] = useState([])

  useEffect(() => {
    // Wait 500ms before calling api to search for users
    const timer = setTimeout(async () => {
      if(searchField.length < 2) {
        setFoundUsers([])
        return
      }
      const users = await searchUsers(searchField, user.id)
      setFoundUsers(users)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchField])

  useEffect(() => {
    getUsersGroups(true)
  }, [])

  const userSelected = (isChecked: boolean, id: string) => {
    console.log("Pressed")
    if(isChecked) {
      setSelectedUsers([... selectedUsers, id])
    } else {
      setSelectedUsers(selectedUsers.filter(searchId => id !== searchId))
    }
  }

  const createPressed = async () => {
    try {
      await createGroup([...selectedUsers, user.id], groupName)
      setShowSearchModal(false)
      setSearchField("")
      setGroupName("")
      setSelectedUsers([])
    } catch (error) {
      Alert.alert("Error creating Group", error.message)
    }
  }

  const getUsersGroups = async (showLoading : boolean) => {
    try {
      setIsLoading(showLoading)
      const groups = await getUserGroups(user.id)
      setUsersGroups(groups)
    } catch (error) {
      Alert.alert("Error getting groups", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {

    const newGroupCreated = async () => {
      await getUsersGroups(false)
    }

    socket.on('newGroup', newGroupCreated)
  }, [])

  return (
    <PageView scroll={false}>
        <PageHeader text='Chat'/>
        <CustomButton
            text='Create Chat'
            onPress={() => setShowSearchModal(true)}
        />
        {isLoading ? <ActivityIndicator/> :
          <FlatList
            className='mt-1'
            data={usersGroups}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <ChatCard name={item.name} groupId={item.id}/>
            )}
            ListEmptyComponent={() => (
              <Text>Create a Chat!</Text>
            )}
          />
        }
        <Modal
          visible={showSearchModal}
          onRequestClose={() => setShowSearchModal(false)}
          animationType='slide'
          style={{
            backgroundColor: "#E0F0F4"
          }}
        >
          <SafeAreaView className='h-full bg-primary-default w-full items-center self-center py-5'>
            <View className='h-full justify-center max-w-[85vw] items-center'>
              <TextInput
                className='p-3 w-[80vw] border-2 rounded-xl border-primary-600 mb-3'
                value={groupName}
                onChangeText={text => setGroupName(text)}
                autoCorrect={false}
                placeholder='Group Name'
              />
              <TextInput
                className='p-3 w-[80vw] border-2 rounded-xl border-primary-600 mb-3'
                value={searchField}
                onChangeText={text => setSearchField(text)}
                autoCorrect={false}
                placeholder='Search for users'
              />
              <FlatList
                className='border w-[80vw] max-h-[50vh] mb-3 p-2'
                data={foundUsers}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <UserSearchCard
                    username={item.username}
                    id={item.id}
                    selected={selectedUsers.includes(item.id)}
                    onPress={userSelected}
                  />
                )}
                ListEmptyComponent={() => (
                  <Text>Search for Users</Text>
                )}
              />
              <CustomButton
                text='Create Group'
                onPress={() => createPressed()}
                buttonStyle='w-[80vw] rounded-xl border bg-primary-600 mb-2'
              />
              <CustomButton
                text='Cancel'
                onPress={() => {
                  setShowSearchModal(false)
                  setSearchField("")
                  setSelectedUsers([])
                }}
                buttonStyle='w-[80vw] rounded-xl border bg-primary-600'
              />
            </View>
          </SafeAreaView>
        </Modal>
    </PageView>
  )
}

export default ChatList