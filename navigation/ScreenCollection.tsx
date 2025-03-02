import LoginScreen from "@/app/screens/auth/LoginScreen";
import RegisterScreen from "@/app/screens/auth/RegisterScreen";
import CustomSplashScreen from "@/app/screens/auth/CustomSplashScreen";
import HomeScreen from "@/app/(tabs)";
import ProfileScreen from "@/app/(tabs)/ProfileScreen";
import TabLayout from "@/app/(tabs)/_layout";

export const authStack: ScreenArray[] = [
  {
    name: 'screens/auth/CustomSplashScreen',
    component: CustomSplashScreen
  },
  {
    name: 'screens/auth/RegisterScreen',
    component: RegisterScreen
  },
  {
    name: 'screens/auth/LoginScreen',
    component: LoginScreen
  }
];

export const dashboardStack: ScreenArray[] = [
  {
    name: "(tabs)",
    component: TabLayout
  }
]; 

export const mergedStacks: ScreenArray[] = [...dashboardStack, ...authStack];