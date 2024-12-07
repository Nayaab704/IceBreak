import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { createMessage, getMessagesForGroup, getNewestMessagesForGroup } from '../../../api/chatApi';
import { IMessage, PictureMessageBubble, Sender, TextMessageBubble, Type, VideoMessageBubble } from '../../Components/MessageBubbles';
import { useGlobalContext } from '../../context/GlobalProvider';
import socket from '../../../api/socket';
import { icons } from '../../../constants';
import { getMessages, storeMessages, updateMessages } from '../../../lib/messageTools';
import Camera from '../../Components/Camera/Camera';
import { useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { usePermissions } from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Chat() {


  const { user } = useGlobalContext()

  const { groupId } = useLocalSearchParams();
  const [chatData, setChatData] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showCamera, setShowCamera] = useState(false)

  /*
      Ask Permissions to use Camera, Microphone, and Library
  */
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions()
  const [microphonePermissions, requestMicrophonePermissions] = useMicrophonePermissions()
  const [mediaLibraryPermissions, requestMediaLibraryPermissions] = usePermissions()

  async function requestAllPermissions() {
    const cameraStatus = await requestCameraPermissions()
    if (!cameraStatus.granted) {
      Alert.alert('Error', "Camera permissions is required")
      return false
    }
    const microphoneStatus = await requestMicrophonePermissions()
    if (!microphoneStatus.granted) {
      Alert.alert('Error', "Microphone permissions is required")
      return false
    }
    const mediaLibraryStatus = await requestMediaLibraryPermissions()
    if (!mediaLibraryStatus.granted) {
      Alert.alert('Error', "Media library permissions is required")
      return false
    }
    await AsyncStorage.setItem('hasOpened', "true")
    return true
  }

  const prevSender = user.username // May use later for displaying messages

  // Fetch chat data based on groupId
  useEffect(() => {
    const fetchChat = async () => {
      try {
        // Get messages in local storage
        const prevMessages = await getMessages(groupId as string)
        if (prevMessages && prevMessages !== '[]') {
          const parsedPrevMessage = JSON.parse(prevMessages)
          const fetchedChatData = parsedPrevMessage[0].createdAt ? await getNewestMessagesForGroup(groupId, parsedPrevMessage[0].createdAt) : []
          const combinedMessages = [...fetchedChatData, ...parsedPrevMessage]
          await storeMessages(groupId as string, JSON.stringify(combinedMessages.slice(0, 20)))
          setChatData(combinedMessages)
        } else {
          const fetchedChatData = await getMessagesForGroup(groupId)
          await storeMessages(groupId as string, JSON.stringify(fetchedChatData))
          setChatData(fetchedChatData)
        }
      } catch (error) {
        Alert.alert("Error fetching chat: ", error.message)
      }
    };

    fetchChat();
  }, []);

  useEffect(() => {

    const handleNewMessage = (data) => {
      if (data.groupId !== groupId)
        return
      setChatData((prevChatData) => [data, ...prevChatData])
    }

    socket.on('newMessage', handleNewMessage)

    return () => {
      socket.off('newMessage', handleNewMessage)
    }
  }, [])

  const openCamera = async () => {
    if (!cameraPermissions.granted || !microphonePermissions.granted || !mediaLibraryPermissions.granted) {
      const permissionsGiven = await requestAllPermissions()
      console.log("Permission not granted!")
      setShowCamera(permissionsGiven)
    } else {
      setShowCamera(true)
      console.log("Permission granted")
    }
  }

  // Only support text currently
  const sendPressed = async (urlP: string | null, mediaTypeP: Type) => {
    try {
      const { content, createdAt, id, mediaType, senderId, url, videoId } = await createMessage({
        content: inputText,
        mediaType: mediaTypeP as string,
        senderId: user.id,
        groupId,
        url: urlP
      })
      const sentMessage = {
        content,
        createdAt,
        id,
        mediaType,
        sender: {
          id: senderId,
          username: user.username
        },
        url,
        videoId
      }
      // setChatData((prevChatData) => [sentMessage, ...prevChatData])
      setInputText("")
      await updateMessages(groupId as string, sentMessage)
    } catch (error) {
      Alert.alert("Error sending message: ", error.message)
    }
  }

  function getType(type): Type {
    if (type === "TEXT" || type === undefined || type === null) {
      return Type.TEXT
    } else if (type === "IMAGE") {
      return Type.IMAGE
    } else if (type === "VIDEO") {
      return Type.VIDEO
    }
  }

  function createIMessage(message): IMessage {
    return {
      id: message.id,
      content: {
        text: message.content,
        imgUri: message.url,
        videoUri: message.url
      },
      type: getType(message.mediaType),
      sender: message.sender.id === user.id ? Sender.USER : Sender.OTHER,
      username: message.sender.username
    }
  }

  const generateChatBubble = (message) => {
    const iMessage: IMessage = createIMessage(message)

    if (iMessage.type === Type.TEXT) {
      return <TextMessageBubble message={iMessage} />
    } else if (iMessage.type === Type.IMAGE) {
      return <PictureMessageBubble message={iMessage} />
    } else {
      return <VideoMessageBubble message={iMessage} />
    }
  }

  if (!chatData) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <KeyboardAvoidingView
      className='flex-1'
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View className="flex-1 justify-start bg-white">
        <FlatList
          inverted
          contentContainerStyle={{
            padding: 16
          }}
          data={chatData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => generateChatBubble(item)}
        />

        {/* <View className="flex-row items-center justify-evenly p-4 border-t mb-2 border-gray-200"> */}
        <View className='py-2 px-1 flex-row justify-evenly items-center'>
          <TouchableOpacity className='scale-50 flex justify-center' onPress={openCamera}>
            <Image
              source={icons.plus}
              tintColor={'black'}
              resizeMode='contain'
            />
          </TouchableOpacity>
          <TextInput
            className="flex-1 p-3 bg-gray-100 rounded-lg"
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            multiline={true}
          />
          <TouchableOpacity onPress={() => sendPressed(null, Type.TEXT)} className="flex=[0.1] ml-2 p-3 bg-blue-500 rounded-lg">
            <Text className="text-white">Send</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={showCamera}
        onRequestClose={() => setShowCamera(false)}
        animationType='slide'
      >
        <Camera showCamera={setShowCamera} inputText={inputText} setInputText={setInputText} sendPressed={sendPressed} />
      </Modal>
    </KeyboardAvoidingView>
  );
}
