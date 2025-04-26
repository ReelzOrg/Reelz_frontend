import { useTheme } from "@/context/themeContext";
import { CustomTheme } from "@/utils/types";
import { router } from "expo-router";
import { useMemo } from "react";
import { View, Text, useWindowDimensions, StyleSheet, StyleProp, ViewStyle, Image, Pressable, TouchableOpacity } from "react-native";

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
    minWidth: 100,
    minHeight: 100,
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
  }
});

export default function ShowPosts({ tab = "posts", data, numColumns, itemStyle }: { tab?: "posts" | "reels", data: any, numColumns: number, itemStyle?: StyleProp<ViewStyle> }) {
  //data is a list of components to be displayed in the grid
  const { width, height } = useWindowDimensions();

  const itemMargin = 2;
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Calculate item dimensions
  const { itemWidth, itemHeight } = useMemo(() => {
    const totalMarginSpace = itemMargin * (numColumns - 1) * 2; // Margin on both sides
    const itemWidth = (width - totalMarginSpace) / numColumns;
    return {
      itemWidth,
      itemHeight: itemWidth * 1.25, // 1.25 = 5/4 aspect ratio
    };
  }, [width, numColumns, itemMargin]);

  // Group items into rows
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < data.length; i += numColumns) {
      result.push(data.slice(i, i + numColumns));
    }
    return result;
  }, [data, numColumns]);

  return (
    <View style={styles.container}>
      {data.length !== 0
      ? (<View style={styles.posts}>
        {rows.map((rowItems, rowIndex) => (
          <View key={rowIndex} style={[styles.row, { marginBottom: itemMargin }]}>
            {rowItems.map((item: any, colIndex: number) => (
              <TouchableOpacity key={colIndex} onPress={() => {
                router.push(`/post/${item._id}`);
              }}>
              <View 
                // key={colIndex}
                style={[
                  styles.item,
                  { 
                    width: itemWidth,
                    height: itemHeight,
                    marginHorizontal: itemMargin / 2,
                  }
                ]}
              >
                {/* {item} */}
                {/* We are taking the first image only because we are not supporting multiple images yet */}
                {/* You might have to put in the colIndex in place of 0 here */}
                <Image src={item.media_items[0].media_url} resizeMode="cover" style={{width: "100%", height: "100%"}} />
              </View>
              </TouchableOpacity>
            ))}
            {/* Add empty views for last row if needed */}
            {rowItems.length < numColumns && Array(numColumns - rowItems.length)
              .fill(null)
              .map((_, index) => (
                <View 
                  key={`empty-${index}`} 
                  style={{ width: itemWidth, marginHorizontal: itemMargin / 2 }}
                />
              ))
            }
          </View>
        ))}
      </View>)
      : (<View style={{alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: 'red', flex: 1}}>
        <Text style={styles.textStyle}>Create your first post</Text>
      </View>
      )
      }
    </View>
  );

  // return (
  //   <FlatList data={formatData(data, numColumns)} renderItem={({ item, index }) => {
  //     if (item.empty) {
  //       return <View style={[styles.item, styles.itemInvisible, { width: itemWidth }]} />;
  //     }
  //     return (
  //       <View style={[styles.item, itemStyle, { width: itemWidth }]}>
  //         {/* {renderItem({ item, index })} */}
  //         <Text>{index}</Text>
  //       </View>
  //     );
  //   }}
  //   keyExtractor={(item) => item.id.toString()}
  //   numColumns={numColumns}
  //   contentContainerStyle={styles.container}
  //   showsVerticalScrollIndicator={false}
  //   />
  // );
}