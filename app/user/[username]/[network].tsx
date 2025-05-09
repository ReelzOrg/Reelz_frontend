import { SearchBar } from "@/components";
import { getData } from "@/utils";
import { LegendList } from "@legendapp/list";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function AllUserNetworkList() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const token = useSelector((state: any) => state.reelzUserToken.jwtToken);
  const { id, network } = useLocalSearchParams();

  const [networkList, setNetworkList] = useState([]);
  const [searchNetworkList, setSearchNetworkList] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function getList() {
      //get the list of followers or following
      const list = await getData(`${baseurl}/api/user/${id}/${network}`, token);
      const data = await list?.json();

      if(data.success && !!data.followers) {setNetworkList(data.followers);}
    }

    getList();
  }, []);

  if(!!!networkList.length) return (<></>);

  return (
    <View>
      <SearchBar searchTerm={searchNetworkList} setSearchTerm={setSearchNetworkList}
        isSearching={isSearching} setIsSearching={setIsSearching}
      />
      <LegendList
        data={networkList}
        recycleItems={true}
        // keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          return (
            <></>
          );
        }}
      />
    </View>
  );
}