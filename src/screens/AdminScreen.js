import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../theme/ThemeContext';
import { FileText, Upload, Trash2, CheckCircle } from 'lucide-react-native';

import { API_URL } from '../config';

export default function AdminScreen() {
    const { theme } = useTheme();
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [queries, setQueries] = useState([]);
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fetchBooks = async () => {
        try {
            const res = await axios.get(`${API_URL}/books/`);
            setBooks(res.data.books || []);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const fetchQueries = async () => {
        try {
            const res = await axios.get(`${API_URL}/queries/list/`, { params: { password } });
            setQueries(res.data || []);
        } catch (error) {
            console.error("Error fetching queries:", error);
            throw error;
        }
    };

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await fetchQueries();
            await fetchBooks();
            setIsAuthenticated(true);
        } catch (error) {
            Alert.alert("Error", "Invalid Admin Password");
        } finally {
            setIsLoading(false);
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                await uploadFile(asset);
            }
        } catch (err) {
            console.error("Picking error:", err);
        }
    };

    const uploadFile = async (asset) => {
        setIsUploading(true);
        const formData = new FormData();
        
        // Handle file differently for web vs mobile
        const fileToUpload = {
            uri: asset.uri,
            name: asset.name,
            type: 'application/pdf',
        };

        formData.append('file', fileToUpload);

        try {
            await axios.post(`${API_URL}/upload-book/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Alert.alert("Success", `${asset.name} uploaded successfully!`);
            await fetchBooks(); // Refresh list
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Error", "Failed to upload file. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={[styles.container, { backgroundColor: theme.background }]}>
                    <View style={[styles.authBox, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.title, { color: theme.text }]}>Admin Access</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                            placeholder="Admin Password"
                            placeholderTextColor={theme.textSecondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            onSubmitEditing={handleLogin}
                        />
                        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={handleLogin} disabled={isLoading}>
                            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Login</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }

    const renderContent = () => {
        return (
            <View style={{ flex: 1 }}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Recently Uploaded Materials</Text>
                <View style={styles.bookList}>
                    {books.map((book, idx) => (
                        <View key={idx} style={[styles.bookItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <View style={[styles.iconBox, { backgroundColor: theme.primaryLight }]}>
                                <FileText color={theme.primary} size={20} />
                            </View>
                            <Text style={[styles.bookName, { color: theme.text }]} numberOfLines={1}>{book}</Text>
                            <CheckCircle color="#10B981" size={18} />
                        </View>
                    ))}
                    {books.length === 0 && <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No textbooks uploaded yet.</Text>}
                </View>

                <Text style={[styles.headerTitle, { color: theme.text, marginTop: 24 }]}>User Queries & Complaints</Text>
                {queries.map((item) => (
                    <View key={item.id} style={[styles.queryCard, { backgroundColor: theme.surface, borderLeftColor: item.type === 'complaint' ? '#EF4444' : '#F59E0B' }]}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.username}>@{item.username}</Text>
                            <Text style={[styles.typeBadge, { backgroundColor: theme.background, color: theme.textSecondary }]}>{item.type.toUpperCase()}</Text>
                        </View>
                        <Text style={[styles.queryContent, { color: theme.text }]}>{item.content}</Text>
                        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
                    </View>
                ))}
                {queries.length === 0 && <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No queries found.</Text>}
            </View>
        );
    };

    return (
        <View style={[styles.dashboardContainer, { backgroundColor: theme.background }]}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {renderContent()}
            </ScrollView>
            
            <TouchableOpacity 
                style={[styles.uploadBtn, { backgroundColor: theme.primary }]} 
                onPress={pickDocument} 
                disabled={isUploading}
            >
                {isUploading ? <ActivityIndicator color="#fff" /> : (
                    <View style={styles.uploadBtnContent}>
                        <Upload color="#fff" size={20} />
                        <Text style={styles.btnText}>Upload New Material</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    authBox: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#F8FAFC',
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    btn: {
        backgroundColor: '#1E3A8A',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    dashboardContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F8FAFC',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    queryCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    username: {
        fontWeight: 'bold',
        color: '#3B82F6',
    },
    typeBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#64748B',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    queryContent: {
        fontSize: 16,
        color: '#1E293B',
        marginBottom: 8,
    },
    timestamp: {
        fontSize: 12,
        color: '#94A3B8',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#64748B',
    },
    uploadBtn: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    uploadBtnContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookList: {
        marginTop: 8,
    },
    bookItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    bookName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    }
});
