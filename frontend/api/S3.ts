import { LOCAL_API_URL } from "@env"
import axios from 'axios';

const API_URL = `${LOCAL_API_URL}/api/s3`;

export const uploadVideoToS3 = async (fileUri: string, username: string) => {

    const video = await fetch(fileUri)
    const contentType = video["headers"]["map"]["content-type"]
    const blob = await video.blob()

    try {
        const response = await axios.post(`${API_URL}/video_upload_pre_signed_url`, {
            contentType,
            username
        })
        const {url, videoFileName}: {url: string, videoFileName: string} = response.data
        const uploadResponse = await fetch(url, {
            method: "PUT",
            body: blob,
            headers: {
                "Content-Type": contentType
            }
        })

        if(uploadResponse.ok) {
            console.log("Video uploaded to S3")
            return videoFileName
        } else {
            console.log("Video upload failed: ", uploadResponse)
            throw new Error("Video upload failed.")
        }

    } catch (error) {
        console.log(error.message)
        throw error.response.data;
    }
    
}

export const uploadPhotoToS3= async (fileUri: string, username: string) => {
    const photo = await fetch(fileUri)
    const contentType = photo["headers"]["map"]["content-type"]
    const blob = await photo.blob()

    try {
        const response = await axios.post(`${API_URL}/photo_upload_pre_signed_url`, {
            contentType,
            username
        })
        const {url, photoFileName}: {url: string, photoFileName: string} = response.data
        const uploadResponse = await fetch(url, {
            method: "PUT",
            body: blob,
            headers: {
                "Content-Type": contentType
            }
        })

        if(uploadResponse.ok) {
            console.log("Photo uploaded to S3")
            return photoFileName
        } else {
            console.log("Photo upload failed: ", uploadResponse)
            throw new Error("Photo upload failed.")
        }
    } catch (error) {
        console.log(error.message)
        throw error.response.data;
    }
}