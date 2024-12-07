import * as React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import IconButton from "./IconButton";
import { Link } from "expo-router";
import { CameraMode } from "expo-camera";

interface BottomRowToolsProps {
  cameraMode: CameraMode;
  setCameraMode: React.Dispatch<React.SetStateAction<CameraMode>>;
}
export default function BottomRowTools({
  cameraMode,
  setCameraMode,
}: BottomRowToolsProps) {
  return (
    <View style={[styles.bottomContainer, styles.directionRowItemsCenter]}>
      <Link href={"/media-library"} asChild>
        <IconButton iconName="library" />
      </Link>
      <View style={{...styles.directionRowItemsCenter , backgroundColor: "transparent"}}>
        <TouchableOpacity onPress={() => setCameraMode("picture")}>
          <Text
            style={{
              fontWeight: cameraMode === "picture" ? "bold" : "100",
              fontSize: 20
            }}
          >
            Picture
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCameraMode("video")}>
          <Text
            style={{
              fontWeight: cameraMode === "video" ? "bold" : "100",
              fontSize: 20,
            }}
          >
            Video
          </Text>
        </TouchableOpacity>
      </View>
      <Link href={"/media-library"} asChild>
        <IconButton iconName="add" />
      </Link>
    </View>
  );
}
const styles = StyleSheet.create({
  directionRowItemsCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  bottomContainer: {
    width: "100%",
    justifyContent: "space-between",
    position: "absolute",
    alignSelf: "center",
    bottom: 6,
  },
});