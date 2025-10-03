import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            setIsAuthenticated(token !== null);
        } catch (error) {
            console.error("Error checking auth:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <View />; // Loading state
    }

    return isAuthenticated ? (
        <Redirect href="/(tabs)/profile" />
    ) : (
        <Redirect href="/login" />
    );
}
