import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { CameraMode } from "expo-camera";
import { Asset, getAlbumsAsync, getAssetsAsync } from "expo-media-library";
import { useEffect, useState } from "react";
import { TouchableOpacity, View, StyleSheet, ScrollView, FlatList, ImageSourcePropType } from "react-native";
import { Image } from "expo-image";

interface MainRowActionsProps {
    handleTakePicture: () => void
    cameraMode: CameraMode
    isRecording: boolean
}

export default function MainRowActions({
    handleTakePicture,
    cameraMode,
    isRecording
}: MainRowActionsProps) {

    const [assets, setAssets] = useState<Asset[]>([])

    useEffect(() => {
        getAlbums()
    }, [])

    async function getAlbums() {
        // const fetchAlbums = await getAlbumsAsync()
        const albumAssets = await getAssetsAsync({
            // album: fetchAlbums[1],
            mediaType: "photo",
            sortBy: 'creationTime',
            first: 4
        })
        setAssets(albumAssets.assets)
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={assets}
                inverted
                renderItem={({item}) => (
                    <Image
                        key={item.id}
                        source={item.uri}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 5
                        }}
                    />
                )}
                horizontal
                contentContainerStyle={{gap: 6}}
                showsHorizontalScrollIndicator={false}
            />
            <TouchableOpacity onPress={handleTakePicture}>
                <Ionicons
                    name={cameraMode === 'picture' ? 'ellipse-outline' : isRecording ? "ellipse-outline" : "ellipse"}
                    color={isRecording ? "gray" : "white"}
                    size={90}
                />
            </TouchableOpacity>
            <ScrollView horizontal contentContainerStyle={{gap: 5}} showsHorizontalScrollIndicator={false}>
                {[0, 1, 2, 3].map(item => (
                    <FontAwesome6 key={item + "FontAwesome"} name="face-grin-wide" size={40} color="white"/>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    position: "absolute",
    bottom: 45,
  },
});