// File: helper/getImageUrl.ts
import { BUCKET_ID, storage } from "@/utils/Appwrite";

export const getImageUrl = (fileId: string) => {
  if (!fileId) return "";

  try {
    // storage.getFilePreview may return a promise
    return storage.getFileViewURL(BUCKET_ID, fileId).href; 
  } catch (err) {
    console.error("Get Image URL error:", err);
    return "";
  }
};
