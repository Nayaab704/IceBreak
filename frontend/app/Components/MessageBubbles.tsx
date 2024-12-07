import { ResizeMode, Video, Audio } from "expo-av"
import { useEffect, useRef, useState } from "react"
import { View, Text, Image, Modal, TouchableOpacity, ActivityIndicator } from "react-native"
import * as VideoThumbnails from 'expo-video-thumbnails';
import { icons } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";

export enum Sender {
    USER,
    OTHER,
}

export enum Type {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO"
}

export interface IMessage {
    id: number
    content: {
        text?: string
        imgUri?: string
        videoUri?: string
    }
    type: Type
    sender: Sender
    username: string
}

export const TextMessageBubble = ({
    message,
}: {
    message: IMessage
}) => {
    return (
        <View
            className={`${message.sender === Sender.OTHER ? "flex-row items-center space-x-4" : ""} mb-2`}
        >
            <View
                className={`p-3 rounded-lg ${message.sender === Sender.USER ? "bg-blue-500 self-end" : "bg-gray-200 self-start"} max-w-[70%]`}
            >
                {message.sender === Sender.OTHER && <Text>{message.username}</Text>}
                <Text className={`${message.sender === Sender.USER ? "text-white" : "text-black"}`}>{message.content.text}</Text>
            </View>
            {message.sender === Sender.OTHER &&
                <TouchableOpacity
                    onPress={() => console.log(`Reply pressed`)}
                >
                    <Image
                        source={icons.reply}
                        resizeMode="contain"
                        className="w-5 h-5"
                    />
                </TouchableOpacity>
            }
        </View>

    )
}

export const PictureMessageBubble = ({
    message,
}: {
    message: IMessage
}) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const { imgUri, text } = message.content


    return (
        <View
            className={`mb-2 p-3 rounded-lg ${message.sender === Sender.USER ? "bg-blue-500 self-end" : "bg-gray-200 self-start"} max-w-[70%] w-full items-center `}
        >
            <TouchableOpacity
                onPress={toggleModal}
            >
                {imageLoading &&
                    <ActivityIndicator size={'large'} color={"#0000ff"}
                        className="absolute w-[50px] h-[50px]"
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: [{ translateX: -25 }, { translateY: -25 }],
                        }} />}
                <Image
                    source={{ uri: imgUri }}
                    resizeMode="cover"
                    alt={imgUri}
                    className="w-[200] h-[200]"
                    onLoadStart={() => setImageLoading(true)}
                    onLoadEnd={() => setImageLoading(false)}
                    onError={(e) => console.log("Error loading image:", e)}
                />

            </TouchableOpacity>
            {text && <Text className={`${message.sender === Sender.USER ? "text-white" : "text-black"} text-start mt-2 w-full`}>{text}</Text>}
            <Modal
                transparent
                visible={modalVisible}
                onRequestClose={toggleModal}
                animationType="slide"
            >
                <SafeAreaView className="justify-center flex-1 bg-primary-300">
                    <View className="w-full items-center">
                        <TouchableOpacity onPress={toggleModal} className="bg-primary-600 rounded p-3 mr-4 self-end">
                            <Text className="text-white text-lg">Close</Text>
                        </TouchableOpacity>
                        <Image source={{ uri: imgUri }} className="w-full h-[80%]" resizeMode="contain" />
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    )
}

export const VideoMessageBubble = ({
    message,
}: {
    message: IMessage
}) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [thumbnailUri, setThumbnailUri] = useState(null)
    const [loading, setLoading] = useState(true)

    const { videoUri, text } = message.content

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const video = useRef<Video>(null)

    useEffect(() => {
        const generateThumbnail = async () => {
            setLoading(true)
            try {
                const imgUri = await VideoThumbnails.getThumbnailAsync(videoUri, {
                    time: 500
                });
                setThumbnailUri(imgUri)
            } catch (error) {
                setThumbnailUri("")
                console.log(error)
            } finally {
                setLoading(false)
            }

        }

        const changeAudio = async () => {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        }

        generateThumbnail()
        changeAudio()

    }, [])



    return (
        <View
            className={`mb-2 p-3 rounded-lg ${message.sender === Sender.USER ? "bg-blue-500 self-end" : "bg-gray-200 self-start"} max-w-[70%] w-full items-center `}
        >
            <TouchableOpacity
                onPress={toggleModal}
            >
                {loading ? (
                    <ActivityIndicator size={'large'} color={"#0000ff"} className="h-[200]" />
                ) : (
                    <View>
                        <Image
                            source={{ uri: thumbnailUri.uri }}
                            resizeMode="cover"
                            alt={thumbnailUri.uri}
                            className="w-[200] h-[200]"
                        />
                        <Image
                            source={icons.play}
                            resizeMode="contain"
                            className="absolute w-[50px] h-[50px]"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: [{ translateX: -25 }, { translateY: -25 }],
                            }}
                        />
                    </View>

                )}

            </TouchableOpacity>
            {text && <Text className={`${message.sender === Sender.USER ? "text-white" : "text-black"} text-start mt-2 w-full`}>{text}</Text>}
            <Modal
                transparent
                visible={modalVisible}
                onRequestClose={toggleModal}
            >
                <SafeAreaView className="flex-1 justify-center items-center bg-primary-300">
                    <View className="w-full items-center">
                        <TouchableOpacity onPress={toggleModal} className="bg-primary-600 rounded p-3 mr-4 self-end">
                            <Text className="text-white text-lg">Close</Text>
                        </TouchableOpacity>
                        <Video
                            className="w-full h-[80%] rounded-xl mt-3"
                            ref={video}
                            source={{ uri: videoUri }}
                            resizeMode={ResizeMode.CONTAIN}
                            useNativeControls
                            shouldPlay={true}

                            onPlaybackStatusUpdate={(status) => {
                                if (status.isLoaded && status.didJustFinish) {
                                    console.log("Video finished")
                                    video.current.playFromPositionAsync(0)
                                    video.current.pauseAsync()
                                }
                                if ('error' in status) {
                                    console.log(status.error)
                                }
                            }}
                        />
                    </View>

                </SafeAreaView>
            </Modal>
        </View>
    )
}

export default TextMessageBubble