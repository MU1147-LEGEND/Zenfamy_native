import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { checkAuth } from "../utils/auth";

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await checkAuth();
                setIsAuthenticated(!!token);
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, []);

    return isAuthenticated ? (
        <Redirect href="/(tabs)/profile" />
    ) : (
        <Redirect href="/login" />
    );
}
