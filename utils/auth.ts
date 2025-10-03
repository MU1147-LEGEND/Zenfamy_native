import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const checkAuth = async (): Promise<string | null> => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
        router.replace("/login");
        return null;
    }
    return token;
};

export const logout = async (): Promise<void> => {
    try {
        await Promise.all([
            AsyncStorage.removeItem("userToken"),
            AsyncStorage.removeItem("refreshToken"),
            AsyncStorage.removeItem("userEmail"),
        ]);
        router.replace("/login");
    } catch (error) {
        console.error("Logout failed:", error);
    }
};
