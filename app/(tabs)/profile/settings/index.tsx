import { TopNavBar } from "@/components";
import SettingSection from "@/components/profileComponents/settingsComponents/settingSection";
import SettingTile from "@/components/profileComponents/settingsComponents/settingTile";
import { useTheme } from "@/hooks/useTheme";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsPage() {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
      <TopNavBar theme={theme} pageTitle="Settings" fallbackRoute="/(tabs)/profile" />
      <ScrollView>
        <SettingSection sectionTitle="Account">
          {/* change visibility (public or private),  */}
          <SettingTile leftIcon="lock" settingTitle="Account Privacy" hasNextPage nextPage="/(tabs)/profile/settings/accountPrivacy" />
          <SettingTile leftIcon="shield" settingTitle="Change Password" hasNextPage nextPage="/(tabs)/profile/settings/changePassword" />
          {/* Opt in or out of mobile, email, & sms notifications */}
          <SettingTile leftIcon="bell" settingTitle="Notification Settings" hasNextPage nextPage="/(tabs)/profile/settings/notificationSettings" />
        </SettingSection>
        <SettingSection sectionTitle="How you use Reelz">
          {/* time spend, add timers/alerts, add parental lock */}
          <SettingTile leftIcon="times-circle-o" settingTitle="Activity" hasNextPage nextPage="/(tabs)/profile/settings/userActivity" />
          <SettingTile leftIcon="bookmark" settingTitle="Saved" hasNextPage nextPage="/(tabs)/profile/settings/savedPosts" />
          <SettingTile leftIcon="heart" settingTitle="Liked" hasNextPage nextPage="/(tabs)/profile/settings/likedPosts" />
          <SettingTile leftIcon="ban" settingTitle="Blocked Users" hasNextPage nextPage="/(tabs)/profile/settings/blockedUsers" />
          {/* Shows a tab view with list of users with most interactions with the current user and least interaction with the current user */}
          <SettingTile leftIcon="" settingTitle="Interactions with other users" hasNextPage nextPage="/(tabs)/profile/settings/userInteractions" />
          {/* <SettingTile leftIcon="" settingTitle="" hasNextPage nextPage="" /> */}
        </SettingSection>
      </ScrollView>
      <StatusBar style={theme.mode == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}