import { SearchedAccTile, SizedBox } from "@/components";
import { useTheme } from "@/hooks/useTheme";
import { getData, navigateBack } from "@/utils";
import { BasicUserObject } from "@/utils/types";
import { FontAwesome } from "@expo/vector-icons";
import { LegendList } from "@legendapp/list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Text, ScrollView, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

// change this to a tab view similar to the post and reels tab in profile so that I can swipe
// to change between followers and following
export default function UserNetworkList() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);
  const theme = useTheme();
  const router = useRouter();
  //this is comming from the loggedin user's profile page
  const { id, network }: { id: string, network: string } = useLocalSearchParams();

  const [networkList, setNetworkList] = useState<BasicUserObject[] | null>([]);
  
  useEffect(() => {
    async function getNetworkList() {
      //call api to fetch all followers
      const netWorkListData = await getData(`${baseurl}/api/user/${id}/${network}`, token);
      const data = await netWorkListData?.json();
      if(data.success) {
        setNetworkList(data.network);
      }
    }

    getNetworkList();

  }, []);

  if(!!!networkList?.length) return (<></>);

  return (
    <SafeAreaView style={{backgroundColor: theme.background, flex: 1}}>
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', alignItems: "center", paddingHorizontal: 8}}>
          <Pressable style={{paddingRight: 8}} onPress={() => {
            navigateBack({router: router, fallbackRoute: "/(tabs)/profile"})
          }}>
            <FontAwesome name="arrow-left" size={25} style={{color: theme.text}} />
          </Pressable>
          <Text style={{fontSize: 24, fontWeight: "700", color: theme.text}}>{network.charAt(0).toUpperCase() + network.slice(1)}</Text>
        </View>
        <SizedBox height={8} />
        <ScrollView>
          <View style={{paddingHorizontal: 20}}>
            <LegendList
              data={networkList}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => {
                return (
                  <SearchedAccTile
                    first_name={item.first_name}
                    last_name={item?.last_name ?? ""}
                    username={item.username}
                    profile_picture={item?.profile_picture ?? undefined}
                  />
                );
              }}
            />
          </View>
        </ScrollView>
      </View>
      <StatusBar style={theme.mode == "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

/**
 * networkList - 
 * [
  {
    createdAt: DateTime {
      year: [Integer],
      month: [Integer],
      day: [Integer],
      hour: [Integer],
      minute: [Integer],
      second: [Integer],
      nanosecond: [Integer],
      timeZoneOffsetSeconds: [Integer],
      timeZoneId: undefined
    },
    _id: '44938b73-afca-4cf9-a298-bd6c5a7bda46',
    username: 'vivek20'
  }
]
 */