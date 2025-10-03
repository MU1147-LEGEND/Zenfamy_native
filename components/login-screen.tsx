import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "https://api.zenfamy.ai/api/v1/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Handle successful login
            console.log("Login successful:", data);
            await AsyncStorage.setItem("userToken", data.access_token);
            await AsyncStorage.setItem("refreshToken", data.refresh_token);
            await AsyncStorage.setItem("userEmail", email);
            router.replace("/(tabs)/profile");
        } catch (err: unknown) {
            setError(
                err instanceof Error ? err.message : "Something went wrong"
            );
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
            <View style={{ marginBottom: 24 }}>
                <ThemedText
                    type="title"
                    style={{ textAlign: "center", fontWeight: "bold" }}
                >
                    Login
                </ThemedText>
            </View>

            <View style={{ gap: 16 }}>
                <View>
                    <ThemedText style={{ marginBottom: 8 }}>Email</ThemedText>
                    <TextInput
                        style={{
                            height: 48,
                            borderWidth: 1,
                            borderColor: "#e2e8f0",
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            backgroundColor: "#f8fafc",
                        }}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View>
                    <ThemedText style={{ marginBottom: 8 }}>
                        Password
                    </ThemedText>
                    <TextInput
                        style={{
                            height: 48,
                            borderWidth: 1,
                            borderColor: "#e2e8f0",
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            backgroundColor: "#f8fafc",
                        }}
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                {error ? (
                    <ThemedText style={{ color: "red", textAlign: "center" }}>
                        {error}
                    </ThemedText>
                ) : null}

                <TouchableOpacity
                    style={{
                        height: 48,
                        backgroundColor: "#3b82f6",
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 8,
                    }}
                    onPress={handleLogin}
                >
                    <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
                        {loading ? "Logging in..." : "Login"}
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginScreen;
