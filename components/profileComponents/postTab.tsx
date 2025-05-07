import { router } from "expo-router";
import { useMemo } from "react";
import { View, Text, useWindowDimensions, StyleSheet, StyleProp, ViewStyle, Image, Pressable, TouchableOpacity, FlatList } from "react-native";

import { CustomTheme } from "@/utils/types";
import { useTheme } from "@/hooks/useTheme";
import { placeholder } from "@/contants/assets";

const createStyles = (theme: CustomTheme) => StyleSheet.create({
  container: {
    // paddingHorizontal: 4, // Half of item margin to balance spacing
  },
  item: {
    // margin: 1, // Adjust as needed
    backgroundColor: '#000000',
    // borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 4/5, // Optional: keep items square
    maxWidth: 400,
    maxHeight: 500,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row', // Arrange items horizontally
    justifyContent: 'flex-start', // Align items to the start (left)
    // marginBottom: 1, // Space between rows
  },
  textStyle: {
    color: theme.text
  },
  posts: {
    flexDirection: 'column',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'red',
  }
});

export default function ShowPosts({ tab = "posts", data, numColumns, itemStyle }: { tab?: "posts" | "reels", data: any, numColumns: number, itemStyle?: StyleProp<ViewStyle> }) {
  //data is a list of components to be displayed in the grid
  const { width } = useWindowDimensions();

  const itemMargin = 2;
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // console.log("the posts are:", data);

  // Calculate item dimensions
  const { itemWidth, itemHeight } = useMemo(() => {
    const totalMarginSpace = itemMargin * (numColumns - 1) * 2; // Margin on both sides
    const itemWidth = (width - totalMarginSpace) / numColumns;
    return {
      itemWidth,
      itemHeight: itemWidth * 1.25, // 1.25 = 5/4 aspect ratio
    };
  }, [width, numColumns]);

  // Format data to include empty items for the last row if needed
  const formattedData = useMemo(() => {
    const completeRows = Math.ceil(data.length / numColumns);
    const totalItems = completeRows * numColumns;
    const formatted = [...data];
    
    // Add empty items to complete the last row
    while (formatted.length < totalItems) {
      formatted.push({ _id: `empty-${formatted.length}`, empty: true });
    }
    
    return formatted;
  }, [data, numColumns]);

  const renderItem = ({item, index}: {item: any, index: number}) => {
    //if('empty' in item) {
    if (item.empty) {
      return <View style={[styles.item, styles.itemInvisible, { width: itemWidth, marginHorizontal: itemMargin / 2 }]} />;
    }
    return (
      <TouchableOpacity
      onPress={() => {
        const start = Math.max(0, index - 2);
        const end = Math.min(data.length, index + 3);

        router.push({
          pathname: "/(tabs)/profile/allposts",
          params: {
            posts: JSON.stringify(data.slice(start, end)), // Pass 5 posts around the selected post
            localPostIndex: index - start,
            globalPostIndex: index,
            // user: 
          }
        })
      }}
      style={[
        styles.item,
        { 
          width: itemWidth,
          height: itemHeight,
          marginHorizontal: itemMargin / 2,
          marginBottom: itemMargin,
        }
      ]}>
        {/* We are taking the first image only because we are not supporting multiple images yet
        and in this component we only want to show the first image */}
        {item.media_items
        ? <Image src={item.media_items[0].media_url} resizeMode="cover" style={{width: "100%", height: "100%"}} />
        : <Image source={placeholder} style={{width: "100%", height: "100%"}}/>
        }
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={formattedData}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
        renderItem={renderItem}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.textStyle}>Create your first post</Text>
          </View>
        }
        contentContainerStyle={{ marginTop: itemMargin, marginHorizontal: itemMargin/2 }}
        columnWrapperStyle={{ marginHorizontal: -itemMargin / 2 }}
        // Performance optimizations
        removeClippedSubviews={true}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={21}
        updateCellsBatchingPeriod={50}
        getItemLayout={(data, index) => ({
          length: itemHeight + itemMargin,
          offset: (itemHeight + itemMargin) * Math.floor(index / numColumns),
          index,
        })}
      />
    </View>
  );

  // return (
  //   <View style={styles.container}>
  //     {data.length !== 0
  //     ? (<View style={styles.posts}>
  //       {rows.map((rowItems, rowIndex) => (
  //         <View key={rowIndex} style={[styles.row, { marginBottom: itemMargin }]}>
  //           {rowItems.map((item: any, colIndex: number) => (
  //             <TouchableOpacity key={colIndex} onPress={() => {
  //               router.push(`/post/${item._id}`);
  //             }}>
  //             <View 
  //               // key={colIndex}
  //               style={[
  //                 styles.item,
  //                 { 
  //                   width: itemWidth,
  //                   height: itemHeight,
  //                   marginHorizontal: itemMargin / 2,
  //                 }
  //               ]}
  //             >
  //               {/* {item} */}
  //               {/* We are taking the first image only because we are not supporting multiple images yet */}
  //               {/* You might have to put in the colIndex in place of 0 here */}
  //               <Image src={item.media_items[0].media_url} resizeMode="cover" style={{width: "100%", height: "100%"}} />
  //             </View>
  //             </TouchableOpacity>
  //           ))}
  //           {/* Add empty views for last row if needed */}
  //           {rowItems.length < numColumns && Array(numColumns - rowItems.length)
  //             .fill(null)
  //             .map((_, index) => (
  //               <View 
  //                 key={`empty-${index}`} 
  //                 style={{ width: itemWidth, marginHorizontal: itemMargin / 2 }}
  //               />
  //             ))
  //           }
  //         </View>
  //       ))}
  //     </View>)
  //     : (<View style={{alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: 'red', flex: 1}}>
  //       <Text style={styles.textStyle}>Create your first post</Text>
  //     </View>
  //     )
  //     }
  //   </View>
  // );
}