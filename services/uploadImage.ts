    import { BUCKET_ID, storage } from "@/utils/Appwrite";
import * as ImagePicker from "expo-image-picker";

    export async function uploadImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
    });

    if (result.canceled) return null;

    const image = result.assets[0];

    const blob = await fetch(image.uri).then(res => res.blob());
    const file = {
        uri: image.uri,
        name: `photo_${Date.now()}.jpg`,
        type: image.type ?? 'image/jpeg',
        size: image.fileSize ?? blob.size,
    };

    try {
        const uploaded = await storage.createFile(BUCKET_ID, "unique()", file);
        return uploaded.$id; 
    } catch (error) {
        console.error("Upload Error:", error);
        return null;
    }
    }
