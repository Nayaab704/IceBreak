import { FlashMode } from "expo-camera";
import { View } from "react-native";
import IconButton from "./IconButton";

interface CameraToolsProps {
   cameraFlash: FlashMode
   cameraFacing: "front" | "back"
   cameraZoom: number
   setCameraFlash: React.Dispatch<React.SetStateAction<FlashMode>>
   setCameraFacing: React.Dispatch<React.SetStateAction<"front" | "back">>
   setCameraZoom: React.Dispatch<React.SetStateAction<number>>
}

export default function CameraTools({
    cameraFlash,
    cameraFacing,
    cameraZoom,
    setCameraFlash,
    setCameraFacing,
    setCameraZoom
}: CameraToolsProps) {
    return (
        <View style={{
            position: 'absolute',
            right: 6,
            gap: 16,
            zIndex: 1
        }}>
            <IconButton
                onPress={() =>
                setCameraFacing((prevValue) =>
                    prevValue === "back" ? "front" : "back"
                )
                }
                iconName="camera-reverse"
                width={25}
                height={21}
            />
            <IconButton
                onPress={() =>
                setCameraFlash((prevValue) => (prevValue === "off" ? "on" : "off"))
                }
                iconName={cameraFlash === "on" ? "flash" : "flash-off"}
            />
            <IconButton
                onPress={() => {}}
                iconName="volume-high"
            />
        </View>
    )
}