import { Image } from "expo-image";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, TextInput, TouchableOpacity, View, Text, ActivityIndicator } from "react-native";
import IconButton from "./IconButton";
import { saveToLibraryAsync } from "expo-media-library";
import { shareAsync } from "expo-sharing";
import { Type } from "../MessageBubbles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

interface PictureViewProps {
    picture: string
    setPicture: React.Dispatch<React.SetStateAction<string>>
    inputText: string
    setInputText: React.Dispatch<React.SetStateAction<string>>
    sendMedia: (mediaType: Type) => Promise<void>
}

export default function PictureView({
    picture,
    setPicture,
    inputText,
    setInputText,
    sendMedia
}: PictureViewProps) {

    const [isSending, setIsSending] = useState(false)

    const insets = useSafeAreaInsets()

    async function sendButtonPressed() {
        setIsSending(true)
        await sendMedia(Type.IMAGE)
        setIsSending(false)
    }

    return (
        <Pressable onPress={Keyboard.dismiss}>
            {isSending && <ActivityIndicator className="absolute top-0 left-0 right-0 bottom-0 justify-center self-center z-50 scale-150" />}
            <View>
                <View style={{
                    position: 'absolute',
                    right: 6,
                    zIndex: 1,
                    paddingTop: 50,
                    gap: 16
                }}>
                    <IconButton
                        iconName="save"
                        onPress={async () => {
                            await saveToLibraryAsync(picture)
                            Alert.alert("Picture saved!!!")
                        }}
                    />
                    <IconButton
                        iconName="share"
                        onPress={async () => await shareAsync(picture)}
                    />
                </View>
                <View style={{
                    position: 'absolute',
                    left: 6,
                    zIndex: 1,
                    paddingTop: 50,
                    gap: 16
                }}>
                    <IconButton
                        iconName="close-circle-outline"
                        onPress={() => setPicture("")}
                    />
                </View>
                <Image
                    source={picture}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                />
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