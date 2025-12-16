import { getAvatarText } from "@/helper/avatar";
import { getImageUrl } from "@/helper/getImageUrl";
import { uploadImage } from "@/services/uploadImage";
import { account } from "@/utils/Appwrite";
import { useAuth } from "@/utils/auth-context";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Avatar, Button, Text, TextInput } from "react-native-paper";

export default function Profile() {
  const { currentuser, refreshUser } = useAuth();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [name, setName] = useState("")
  const [email, setEmail] = useState(currentuser?.email || "")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState(currentuser?.phone || "+855")

  useEffect(() => {
    // console.log(currentuser);
    console.log(currentuser?.phone);
    console.log(currentuser?.phoneVerification); 
    

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
      const updatedUser = await account.updatePrefs({ avatar: fileId }); 
      await refreshUser();
      setAvatarId(fileId);
      Alert.alert("Success", "Avatar updated!");
      console.log("Updated user:", updatedUser);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update avatar");
    }
  };

  const handeUpdate = async () => {
    setLoading(true)
    try {
    if (name !== currentuser?.name) {
      await account.updateName(name)
      await refreshUser();
    }
    if (phone && phone !== currentuser?.phone) {
      if (!password) {
        Alert.alert("Password is require to update phone");
        setLoading(false)
        return;
      }
      await account.updatePhone(phone, password)
      await account.createPhoneVerification()
      await refreshUser();
      setShowOtp(true);
      Alert.alert("OTP Sent", "Please enter the OTP sent to your phone");
    }
    if (email !== currentuser?.email) {
      if (!password) {
        Alert.alert("Password is require");
        setLoading(false);
        return
      } 
      await account.updateEmail(email, password)
      await refreshUser();
      Alert.alert("Email updated", "Please verify your new email");
      setPassword("");
    }

      Alert.alert("Success", "Profile updated");
    } catch (e) {
      Alert.alert("error, update")
      console.error(e)
    } finally {

      setLoading(false) 
    }
  }
  const verifyPhoneOtp = async () => {
  if (!otp) {
    Alert.alert("Enter OTP");
    return;
  }

  setVerifyingOtp(true);

  try {
    await account.updatePhoneVerification(
      "current",
      otp
    );

    await refreshUser();
    Alert.alert("Success", "Phone number verified");

    setOtp("");
    setShowOtp(false);
  } catch (e) {
    Alert.alert("Invalid OTP");
    console.error(e);
  } finally {
    setVerifyingOtp(false);
  }
};


  return (
    <KeyboardAvoidingView style={styles.container} >
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
        value={name}
        onChangeText={setName}
        style={{ width: "100%", marginTop: 20 }}
      />
      <TextInput 
        label="Phone Number"
        placeholder="Please Update Your Phone Number"
        mode='outlined' 
        value={phone}
        onChangeText={setPhone}
        style={{ width: "100%", marginTop: 20 }}
      />
      {showOtp && (
          <>
            <TextInput
              label="OTP Code"
              mode="outlined"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
              style={{ width: "100%", marginTop: 20 }}
            />

            <Button
              mode="contained"
              loading={verifyingOtp}
              onPress={verifyPhoneOtp}
              style={{ marginTop: 10 }}
            >
              Verify Phone
            </Button>
          </>
        )}

      <TextInput 
        label="Email"
        mode='outlined'
        value={email}
        onChangeText={setEmail}
        style={{ width: "100%", marginTop: 20 }}
      />
      <TextInput 
        label="Password"
        mode='outlined'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        right={<TextInput.Icon icon="eye" />}
        style={{ width: "100%", marginTop: 20 }}
      />

      <Button
        mode="contained"
        textColor="#fff"
        buttonColor="green"
        rippleColor="red"
        loading={loading}
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
