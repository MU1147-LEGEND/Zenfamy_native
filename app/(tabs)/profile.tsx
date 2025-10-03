import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ThemedText } from "../../components/themed-text";

type UserData = {
    user_id?: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    country: string;
    preferred_language: string;
    loading?: boolean;
    error?: string;
};

export default function UserProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [wholeData, setWholeData] = useState<object>({});
    const [userInfo, setUserInfo] = useState<UserData>({
        first_name: "Loading...",
        last_name: "",
        email: "Loading...",
        role: "Loading...",
        country: "Loading...",
        preferred_language: "Loading...",
        loading: true,
    });

    // load first time
    useEffect(() => {
        loadUserInfo();
    }, []);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                throw new Error("No auth token found");
            }

            const response = await fetch(
                "https://api.zenfamy.ai/api/v1/users/me",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...wholeData,
                        first_name: userInfo.first_name,
                        last_name: userInfo.last_name,
                        country: userInfo.country,
                        preferred_language: userInfo.preferred_language,
                        role: userInfo.role,
                        email: userInfo.email,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const errorMessage =
                    data.detail || data.message || "Failed to update user data";
                throw new Error(errorMessage);
            }

            // Refresh the UI after successful update
            await loadUserInfo();
            setIsEditing(false);
        } catch (error) {
            setUserInfo((prev) => ({
                ...prev,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to save user data",
            }));
        } finally {
            setIsSaving(false);
        }
    };

    const loadUserInfo = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                throw new Error("No auth token found");
            }

            const response = await fetch(
                "https://api.zenfamy.ai/api/v1/users/me",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }

            const data = await response.json();
            setWholeData(data);
            setUserInfo({
                user_id: data.user_id,
                first_name: data.first_name || "Not set",
                last_name: data.last_name || "",
                email: data.email,
                role: data.role,
                country: data.country,
                preferred_language: data.preferred_language,
                loading: false,
            });
        } catch (error) {
            setUserInfo((prev) => ({
                ...prev,
                loading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to load user data",
            }));
        }
    };

    const handleLogout = async () => {
        try {
            // clear stored data (from async storage)
            await Promise.all([
                AsyncStorage.removeItem("userToken"),
                AsyncStorage.removeItem("refreshToken"),
                AsyncStorage.removeItem("userEmail"),
            ]);
            // go to login
            router.replace("/login");
        } catch (error) {
            return error;
        }
    };

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.container}
        >
            <View style={styles.header}>
                <ThemedText type="title" style={styles.title}>
                    User Profile
                </ThemedText>
            </View>
            {/* user information */}
            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <ThemedText style={styles.label}>First Name</ThemedText>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={userInfo.first_name}
                            onChangeText={(text) =>
                                setUserInfo((prev) => ({
                                    ...prev,
                                    first_name: text,
                                }))
                            }
                            placeholder="Enter first name"
                        />
                    ) : (
                        <ThemedText style={styles.value}>
                            {userInfo.first_name || "Not set"}
                        </ThemedText>
                    )}
                </View>

                <View style={styles.infoItem}>
                    <ThemedText style={styles.label}>Last Name</ThemedText>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={userInfo.last_name}
                            onChangeText={(text) =>
                                setUserInfo((prev) => ({
                                    ...prev,
                                    last_name: text,
                                }))
                            }
                            placeholder="Enter last name"
                        />
                    ) : (
                        <ThemedText style={styles.value}>
                            {userInfo.last_name || "Not set"}
                        </ThemedText>
                    )}
                </View>

                <View style={styles.infoItem}>
                    <ThemedText style={styles.label}>Email</ThemedText>
                    <ThemedText style={styles.value}>
                        {userInfo.email}
                    </ThemedText>
                </View>

                <View style={styles.infoItem}>
                    <ThemedText style={styles.label}>Role</ThemedText>
                    <ThemedText style={styles.value}>
                        {userInfo.role.charAt(0).toUpperCase() +
                            userInfo.role.slice(1)}
                    </ThemedText>
                </View>

                <View style={styles.infoItem}>
                    <ThemedText style={styles.label}>Country</ThemedText>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={userInfo.country}
                            onChangeText={(text) =>
                                setUserInfo((prev) => ({
                                    ...prev,
                                    country: text,
                                }))
                            }
                            placeholder="Enter country"
                        />
                    ) : (
                        <ThemedText style={styles.value}>
                            {userInfo.country}
                        </ThemedText>
                    )}
                </View>

                <View style={styles.infoItem}>
                    <ThemedText style={styles.label}>Language</ThemedText>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={userInfo.preferred_language}
                            onChangeText={(text) =>
                                setUserInfo((prev) => ({
                                    ...prev,
                                    preferred_language: text,
                                }))
                            }
                            placeholder="Enter language code (e.g., en, fr)"
                        />
                    ) : (
                        <ThemedText style={styles.value}>
                            {userInfo.preferred_language.toUpperCase()}
                        </ThemedText>
                    )}
                </View>

                {userInfo.error ? (
                    <View style={[styles.infoItem, styles.errorItem]}>
                        <ThemedText style={styles.errorText}>
                            {userInfo.error}
                        </ThemedText>
                    </View>
                ) : null}
            </View>
            {/* action buttons */}
            <View style={styles.actionContainer}>
                {isEditing ? (
                    <View style={styles.editActions}>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleSave}
                            disabled={isSaving}
                        >
                            <ThemedText style={styles.buttonText}>
                                {isSaving ? "Saving..." : "Save"}
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => {
                                setIsEditing(false);
                                loadUserInfo(); // Reset to original data
                            }}
                        >
                            <ThemedText style={styles.buttonText}>
                                Cancel
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.button, styles.editButton]}
                        onPress={() => setIsEditing(true)}
                    >
                        <ThemedText style={styles.buttonText}>
                            Edit Info
                        </ThemedText>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.button, styles.logoutButton]}
                    onPress={handleLogout}
                >
                    <ThemedText style={styles.logoutText}>Logout</ThemedText>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

// The styles completely AI Generated below.

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        padding: 20,
        paddingBottom: 40, // Add extra padding at bottom for better scrolling
    },
    header: {
        marginBottom: 32,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    infoContainer: {
        gap: 20,
    },
    infoItem: {
        backgroundColor: "#f8fafc",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    label: {
        fontSize: 14,
        color: "#64748b",
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: "#0f172a",
    },
    input: {
        fontSize: 16,
        color: "#0f172a",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 6,
        padding: 8,
        backgroundColor: "#ffffff",
    },
    actionContainer: {
        marginTop: 32,
        gap: 16,
    },
    editActions: {
        flexDirection: "row",
        gap: 12,
    },
    button: {
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        flex: 1,
    },
    editButton: {
        backgroundColor: "#3b82f6",
    },
    saveButton: {
        backgroundColor: "#059669",
    },
    cancelButton: {
        backgroundColor: "#64748b",
    },
    logoutButton: {
        backgroundColor: "#ef4444",
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
    },
    logoutText: {
        color: "white",
        fontWeight: "600",
    },
    errorItem: {
        backgroundColor: "#fef2f2",
        borderColor: "#ef4444",
    },
    errorText: {
        color: "#ef4444",
        textAlign: "center",
    },
});
