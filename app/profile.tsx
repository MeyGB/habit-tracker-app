import { getAvatarText } from "@/helper/avatar";
import { getImageUrl } from "@/helper/getImageUrl";
import { uploadImage } from "@/services/uploadImage";
import { account } from "@/utils/Appwrite";
import { useAuth } from "@/utils/auth-context";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";

export default function Profile() {
  const { currentuser, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarId, setAvatarId] = useState<string | null>(null);

  useEffect(() => {
    console.log(currentuser);
    
    if (currentuser?.prefs?.avatar) {
      setAvatarId(currentuser.prefs.avatar);
    }
  }, [currentuser]);
  console.log("Avatar ID:", avatarId); 
  console.log("Avatar URL:", getImageUrl(avatarId));

  const handleUpload = async () => {
    setLoading(true);
    const fileId = await uploadImage();
    setLoading(false);

    if (fileId) {
      Alert.alert("Success");
    } else {
        console.error("Error", "Image upload failed", Error)
        return;
    } 

    try {
      // Save avatar in user prefs via Appwrite
      const updatedUser = await account.updatePrefs({ avatar: fileId }); 
      setAvatarId(fileId);
      Alert.alert("Success", "Avatar updated!");
      console.log("Updated user:", updatedUser);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update avatar");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 20 }}>
        My Profile
      </Text>
 
      {avatarId ? (
        <Avatar.Image size={120} source={{ uri: getImageUrl(avatarId) }} />
      ) : (
        <Avatar.Text size={120} label={getAvatarText(currentuser?.name || "")} />
      )}

      <Button
        mode="contained"
        style={{ marginTop: 20 }}
        loading={loading}
        onPress={handleUpload}
      >
        Upload Avatar
      </Button>

      <Text variant="bodyMedium" style={{ marginTop: 20 }}>
        Name: {currentuser?.name}
      </Text>
      <Text variant="bodyMedium">Email: {currentuser?.email}</Text>

      <Button
        mode="outlined"
        style={{ marginTop: 20 }}
        onPress={() => signOut()}
      >
        Sign Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
