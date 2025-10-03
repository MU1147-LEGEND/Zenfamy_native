import { Stack } from "expo-router";
import React from "react";

import LoginScreen from "@/components/login-screen";

export default function LoginRoute() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <LoginScreen />
        </>
    );
}
