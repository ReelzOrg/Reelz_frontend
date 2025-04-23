import { getData } from "@/utils";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function UserNetworkList() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);
  const { id, network } = useLocalSearchParams();

  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    async function getList() {
      //get the list of followers or following
      const list = await getData(`${baseurl}/api/user/${id}/${network}`, token);
      const data = await list?.json();

      if(data.success && !!data.followers) {
        setFollowers(data.followers);
      }
    }

    getList();
  }, []);

  if(!!!followers.length) return (<></>);

  return (
    <View>
      <FlatList
        data={followers}
        renderItem={({ item, index }) => {
          return (
            <></>
          );
        }}
      />
    </View>
  );
}