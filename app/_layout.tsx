import { Stack } from 'expo-router/stack';
import { Provider } from "react-redux";
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider } from '@/context/themeContext';
import store from '@/state/store';

export default function Layout() {

  useEffect(() => {}, []);

  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <ThemeProvider>
          <Stack screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name="/(tabs)/home" options={{ headerShown: false }} />
            <Stack.Screen name="/(auth)/login" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}