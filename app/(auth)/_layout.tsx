import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Stack } from 'expo-router/stack';

export default function AuthScreens({ children }: { children: React.ReactNode }) {
  useEffect(() => {}, []);
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{}} />
      <Stack.Screen name="register" options={{}} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {}
})