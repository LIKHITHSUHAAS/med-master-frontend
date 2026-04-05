import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import axios from 'axios';

import { API_URL } from '../config';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [errorMsg, setErrorMsg] = useState('');

    const handleAuth = async () => {
        setErrorMsg('');
        if (!username || !password || (mode === 'register' && !email)) {
            setErrorMsg("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        try {
            if (mode === 'register') {
                const res = await axios.post(`${API_URL}/register/`, {
                    email, username, password
                });
                if (res.data.id) {
                    navigation.replace('Home');
                }
            } else {
                const res = await axios.post(`${API_URL}/login/`, {
                    username, password
                });
                if (res.data.id) {
                    navigation.replace('Home');
                }
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.detail || "Invalid credentials / Network error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdminLogin = () => {
        // Direct jump to admin screen, it prompts for password inside
        navigation.navigate('Admin');
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <View style={styles.heroSection}>
                    <Text style={styles.title}>Med-Master AI</Text>
                    <Text style={styles.subtitle}>{mode === 'login' ? 'Welcome Back, Doctor' : 'Start Your Journey'}</Text>
                </View>

                <View style={styles.formContainer}>
                    {mode === 'register' && (
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onSubmitEditing={handleAuth}
                        />
                    )}
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        onSubmitEditing={handleAuth}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        onSubmitEditing={handleAuth}
                    />

                    {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

                    <TouchableOpacity style={styles.primaryBtn} onPress={handleAuth} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#fff" /> : 
                            <Text style={styles.primaryBtnText}>{mode === 'login' ? 'Sign In' : 'Sign Up'}</Text>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
                        <Text style={styles.switchModeText}>
                            {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.adminBtn} onPress={handleAdminLogin}>
                    <Text style={styles.adminBtnText}>Admin Direct Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    heroSection: {
        backgroundColor: '#1E3A8A',
        padding: 40,
        paddingTop: 80,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#93C5FD',
        fontSize: 16,
        marginTop: 8,
    },
    formContainer: {
        padding: 24,
        marginTop: 20,
    },
    input: {
        backgroundColor: '#fff',
        height: 56,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        fontSize: 16,
    },
    primaryBtn: {
        backgroundColor: '#1E3A8A',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#1E3A8A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchModeText: {
        textAlign: 'center',
        marginTop: 24,
        color: '#3B82F6',
        fontWeight: 'bold',
        fontSize: 14,
    },
    adminBtn: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
    },
    adminBtnText: {
        color: '#94A3B8',
        textDecorationLine: 'underline',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    }
});
