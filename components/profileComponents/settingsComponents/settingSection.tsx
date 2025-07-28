import { Text, View } from "react-native";

export default function SettingSection({ sectionTitle, children }: { sectionTitle: string, children: React.ReactNode }) {
  return (
    <View style={{ borderTopWidth: 5, borderTopColor: "gray", padding: 16 }}>
      <Text style={{ paddingBottom: 16, fontSize: 14, fontWeight: 'bold' }}>{sectionTitle}</Text>
      {children}
    </View>
  );
}