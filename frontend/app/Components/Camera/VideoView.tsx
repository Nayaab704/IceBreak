import { Alert, TextInput, TouchableOpacity, View, Text, KeyboardAvoidingView, Platform, Keyboard, Pressable } from "react-native";
import IconButton from "./IconButton";
import { saveToLibraryAsync } from "expo-media-library";
import { shareAsync } from "expo-sharing";
import React from "react";
import { ResizeMode, Video } from "expo-av";
import { Type } from "../MessageBubbles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native-paper";

interface VideoViewComponentProps {
    video: string
    setVideo: React.Dispatch<React.SetStateAction<string>>
    inputText: string
    setInputText: React.Dispatch<React.SetStateAction<string>>
    sendMedia: (mediaType: Type) => Promise<void>
}

export default function VideoViewComponent({
    video,
    setVideo,
    inputText,
    setInputText,
    sendMedia
}: VideoViewComponentProps) {

    const videoViewRef = React.useRef<Video>(null)
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [isSending, setIsSending] = React.useState(false)

    const insets = useSafeAreaInsets()

    async function sendButtonPressed() {
        setIsSending(true)
        await sendMedia(Type.VIDEO)
        setIsSending(false)
    }

    // const player = useVideoPlayer(video, (player) => {
    //     player.loop = true
    //     player.muted = true
    //     player.play()
    // })

    // React.useEffect(() => {
    //     const subscription = player.addListener('playingChange', (isPlaying) => {
    //         setIsPlaying(isPlaying)
    //     })

    //     return () => {
    //         subscription.remove()
    //     }
    // }, [player])

    return (
        <Pressable onPress={Keyboard.dismiss}>
            {isSending && <ActivityIndicator className="absolute top-0 left-0 right-0 bottom-0 justify-center self-center z-50 scale-150"/>}
            <View style={{
                position: 'absolute',
                right: insets.right + 10,
                zIndex: 1,
                paddingTop: insets.top,
                gap: 16
            }}>
                <IconButton
                    iconName="save"
                    onPress={async () => {
                        await saveToLibraryAsync(video)
                        Alert.alert("Picture saved!!!")
                    }}
                />
                <IconButton
                    iconName={isPlaying ? "pause" : "play"}
                    onPress={() => {
                        if (isPlaying) {
                            videoViewRef.current.pauseAsync()
                        } else {
                            videoViewRef.current.playAsync()
                        }
                        setIsPlaying(!isPlaying)
                    }}
                />
                <IconButton
                    iconName="share"
                    onPress={async () => await shareAsync(video)}
                />
            </View>
            <View style={{
                position: 'absolute',
                left: insets.left + 10,
                zIndex: 1,
                paddingTop: insets.top,
                gap: 16
            }}>
                <IconButton
                    iconName="close"
                    onPress={() => {
                        setVideo("")
                        setInputText("")
                    }}
                />
            </View>
            
            <View className="w-full h-full relative">
                <Video
                    ref={videoViewRef}
                    source={{
                        uri: video
                    }}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    className="w-full h-full relative"
                />
                <View className={`absolute top-0 left-0 w-full h-full ${isSending && "bg-black-100 opacity-30"}`}></View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                style={{
                    position: 'absolute',
                    bottom: insets.bottom,
                    left: insets.left,
                    right: insets.right,
                }}
            >
                <View className="py-2 px-1 flex-row justify-evenly items-center z-50">
                    <TextInput
                        className="flex-1 p-3 bg-black rounded-lg text-white"
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        placeholderTextColor={"white"}
                        multiline={true}
                    />
                    <TouchableOpacity
                        onPress={sendButtonPressed}
                        className="flex-9 ml-2 p-3 bg-blue-500 rounded-lg"
                    >
                        <Text className="text-white">Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Pressable>
    )
}