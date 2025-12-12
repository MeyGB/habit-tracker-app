import { getAvatarText } from "@/helper/avatar";
import { getImageUrl } from "@/helper/getImageUrl";
import { uploadImage } from "@/services/uploadImage";
import { account } from "@/utils/Appwrite";
import { useAuth } from "@/utils/auth-context";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Avatar, Button, Text, TextInput } from "react-native-paper";

export default function Profile() {
  const { currentuser, signOut } = useAuth();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [avatarId, setAvatarId] = useState<string | null>(null);

  const [name, setName] = useState("")

  useEffect(() => {
    console.log(currentuser);

    
    if (currentuser?.prefs?.avatar) {
      setAvatarId(currentuser.prefs.avatar);
    }
    if (currentuser?.name) {
      setName(currentuser.name);
    }
  }, [currentuser]);
  console.log("Avatar ID:", avatarId); 
  console.log("Avatar URL:", getImageUrl(avatarId));

  const handleUpload = async () => {
    setUploadLoading(true);
    const fileId = await uploadImage();
    setUploadLoading(false);

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

  const handeUpdate = async () => {
    setNameLoading(true)
    try {
    const result = await account.updateName(name)
    if (result) {
      Alert.alert("Success", "Name updated!");
      
    } 
    } catch (e) {
      Alert.alert("error, update")
      console.error(e)
    }
    setNameLoading(false) 
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
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
        loading={uploadLoading}
        onPress={handleUpload}
      >
        Upload Avatar
      </Button>
      <TextInput 
        label="Name"
        placeholder="Please Update Your Name"
        mode='outlined'
        defaultValue={currentuser?.name}
        value={name}
        onChangeText={setName}
        style={{ width: "100%", marginTop: 20 }}
      />
      <TextInput 
        label="email"
        mode='outlined'
        value={currentuser?.email}
        style={{ width: "100%", marginTop: 20 }}
      />

      <Button
        mode="contained"
        loading={nameLoading}
        style={{ marginTop: 20 }}
        onPress={handeUpdate}
      >
        Update
      </Button>
    </KeyboardAvoidingView>
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
