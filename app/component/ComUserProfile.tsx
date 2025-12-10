import { getAvatarText } from "@/helper/avatar";
import { getImageUrl } from "@/helper/getImageUrl";
import { useAuth } from "@/utils/auth-context";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Avatar, Divider, Menu, Text } from "react-native-paper";

export default function ComUserProfile() {
  const { currentuser, signOut } = useAuth();
  const [visible, setVisible] = useState(false);
  const [avatarId, setAvatarId] = useState<string | null>(null);

  useEffect(() => {
    console.log(currentuser);
    
    if (currentuser?.prefs?.avatar) {
      setAvatarId(currentuser.prefs.avatar);
    }
  }, [currentuser]);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const openRoute = (route: string) => {
    closeMenu();
    router.push(route);
  };

  const logout = () => {
    closeMenu();
    signOut();
  };

  const AvatarProfile = () => (
    <Pressable onPress={openMenu} style={{ marginRight: 10 }}>
      {avatarId ? (
        <Avatar.Image size={45} source={{ uri: getImageUrl(avatarId) }} />
      ) : (
        <Avatar.Text size={45} label={getAvatarText(currentuser?.name ?? "")} />
      )}
    </Pressable>
  );

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<AvatarProfile />}
        anchorPosition="bottom"
        statusBarHeight={30}
      >
        {/* Profile Header */}
        <View
          style={{
            width: 180,
            alignItems: "center",
            paddingVertical: 10,
          }}
        >
          <Text variant="titleMedium">{currentuser?.name ?? ""}</Text>
          <Text variant="bodySmall" style={{ opacity: 0.7 }}>
            {currentuser?.email ?? ""}
          </Text>
        </View>

        <Divider />

        {/* Menu Items */}
        <Menu.Item
          leadingIcon="account"
          onPress={() => openRoute("/profile")}
          title="My Profile"
        />

        <Divider />

        <Menu.Item
          leadingIcon="logout"
          onPress={logout}
          title="Logout"
        />
      </Menu>
    </View>
  );
}
