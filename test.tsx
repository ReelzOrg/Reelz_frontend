// const { width, height } = useWindowDimensions();
//   const LOAD_AHEAD = height * 2; // Load items 2 screens ahead
//   const UNLOAD_BEHIND = height * 1.5; // Unload items 1.5 screens behind
//   const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
//   const [mediaAssets, setMediaAssets] = useState<MediaLibrary.Asset[]>([]);
//   const [loadedMedia, setLoadedMedia] = useState({});
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [hasPermission, setHasPermission] = useState(false);
//   const flatListRef = useRef(null);
//   const viewableItems = useRef([]);

//   const themeMode = useSelector((state: any) => state.theme.mode);
//   const theme = useTheme();

//   const styles = createStyles(theme);

// // Request media library permission
// const getPermission = async () => {
//   const { status } = await MediaLibrary.requestPermissionsAsync();
//   console.log('Media Library Permission Status:', status);
//   setHasPermission(status === 'granted');
// };

// // Render each media item
// const renderItem = ({ item, index }: { item: any, index: number }) => {
//   const isSelected = selectedItems.some(selected => selected.id === item.id);
//   const isLoaded = loadedMedia[item.id];

//   return (
//     <TouchableOpacity
//       style={[styles.itemContainer, isSelected && styles.selectedItem]}
//       onPress={() => toggleSelection(item)}
//       activeOpacity={0.7}
//     >
//       {isLoaded ? (
//         item.mediaType === 'photo' ? (
//           <FastImage
//             style={styles.media}
//             source={{ uri: item.uri }}
//             resizeMode={FastImage.resizeMode.cover}
//           />
//         ) : (
//           <Video
//             style={styles.media}
//             source={{ uri: item.uri }}
//             resizeMode={ResizeMode.COVER}
//             shouldPlay={false}
//             isMuted={true}
//             useNativeControls={true}
//           />
//         )
//       ) : (
//         <View style={styles.placeholder} />
//       )}
//       {isSelected && <View style={styles.selectionIndicator} />}
//     </TouchableOpacity>
//   );
// };

// // Load all asset references (without actual media)
// const loadAssetReferences = async () => {
//   if (!hasPermission) return;
  
//   try {
//     const { assets } = await MediaLibrary.getAssetsAsync({
//       first: Number.MAX_SAFE_INTEGER,
//       mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
//       sortBy: ['creationTime'],
//     });

//     setMediaAssets(assets);
//   } catch (error) {
//     console.error('Error loading media:', error);
//   }
// };

// // Update which media should be loaded based on scroll position
// const updateLoadedMedia = useCallback(() => {
//   if (!viewableItems.current.length) return;

//   const firstVisible = viewableItems.current[0]?.index || 0;
//   const lastVisible = viewableItems.current[viewableItems.current.length - 1]?.index || 0;
  
//   const loadStart = Math.max(0, firstVisible - Math.floor(LOAD_AHEAD / 100));
//   const loadEnd = Math.min(mediaAssets.length - 1, lastVisible + Math.floor(LOAD_AHEAD / 100));
  
//   const unloadStart = 0;
//   const unloadEnd = Math.max(0, firstVisible - Math.floor(UNLOAD_BEHIND / 100));
  
//   // Load new items
//   const newlyLoaded = {};
//   for (let i = loadStart; i <= loadEnd; i++) {
//     newlyLoaded[mediaAssets[i].id] = mediaAssets[i];
//   }
  
//   // Unload items that are far away
//   const updatedLoadedMedia = { ...newlyLoaded };
//   for (let i = unloadStart; i <= unloadEnd; i++) {
//     delete updatedLoadedMedia[mediaAssets[i].id];
//   }
  
//   setLoadedMedia(updatedLoadedMedia);
// }, [mediaAssets]);

// // Toggle item selection
// const toggleSelection = (item: any) => {
//   setSelectedItems(prev => {
//     const isSelected = prev.some(selected => selected.id === item.id);
//     return isSelected
//       ? prev.filter(selected => selected.id !== item.id)
//       : [...prev, item];
//   });
// };

// // Handle viewable items change
// const onViewableItemsChanged = useCallback(({ viewableItems: visibleItems }) => {
//   viewableItems.current = visibleItems;
//   updateLoadedMedia();
// }, []);

// useEffect(() => {
//   // maybe store the permissions in redux store when user registers first time and then check if they are already
//   // granted here
//   async function checkPermissions() {
//     await getPermission();
//   }
//   checkPermissions();
// }, []);

// useEffect(() => {
//   async function loadAssets() {
//     if (hasPermission) {
//       loadAssetReferences();
//     }
//   }
//   loadAssets();
// }, [hasPermission]);

// if (!hasPermission) {
//   return (
//     <SafeAreaView style={{flex: 1, backgroundColor: theme.background}}>
//       <View style={styles.permissionContainer}>
//         <Text style={{color: theme.text}}>Permission to access media library is required</Text>
//       </View>
//       <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
//     </SafeAreaView>
//   );
// }

// return (
//   <SafeAreaView style={{flex: 1, backgroundColor: theme.background}}>
//   <View style={styles.container}>
//     <FlatList
//       ref={flatListRef}
//       data={mediaAssets}
//       renderItem={renderItem}
//       keyExtractor={item => item.id}
//       numColumns={3}
//       onViewableItemsChanged={onViewableItemsChanged}
//       viewabilityConfig={{
//         itemVisiblePercentThreshold: 50,
//         minimumViewTime: 300,
//       }}
//       initialNumToRender={12} // Render enough to fill screen initially
//       windowSize={3} // Render 3 screens worth of items
//       maxToRenderPerBatch={6} // Render 6 items at a time
//       updateCellsBatchingPeriod={50} // Batch updates every 50ms
//     />
    
//     {selectedItems.length > 0 && (
//       <View style={styles.selectionBar}>
//         <Text>{selectedItems.length} selected</Text>
//       </View>
//     )}
//   </View>
//   <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
//   </SafeAreaView>
// );