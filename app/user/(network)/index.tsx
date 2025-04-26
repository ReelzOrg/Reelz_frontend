import { SearchBar } from "@/components";
import { getData } from "@/utils";
import { LegendList } from "@legendapp/list";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function UserNetworkList() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);
  const { id, network } = useLocalSearchParams();

  const [followers, setFollowers] = useState([]);
  const [searchFollowers, setSearchFollowers] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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
      <SearchBar searchTerm={searchFollowers} setSearchTerm={setSearchFollowers}
        isSearching={isSearching} setIsSearching={setIsSearching}
      />
      <LegendList
        data={followers}
        recycleItems={true}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          return (
            <></>
          );
        }}
      />
    </View>
  );
}