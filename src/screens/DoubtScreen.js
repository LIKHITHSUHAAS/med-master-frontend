import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { ArrowLeft, User, Brain, ExternalLink } from 'lucide-react-native';
import axios from 'axios';
import { useTheme } from '../theme/ThemeContext';

import { API_URL } from '../config';

export default function DoubtScreen({ route, navigation }) {
    const { context } = route.params || { context: "General Medical Query" };
    const { theme } = useTheme();

    const [query, setQuery] = useState("");
    const [msgs, setMsgs] = useState([
        { role: 'ai', text: `Hi Doctor. You are currently in the context of "${context}". What medical doubt can I help clarify?`, images: [] }
    ]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!query.trim()) return;

        const userText = query;
        setQuery("");
        setMsgs(prev => [...prev, { role: 'user', text: userText, images: [] }]);
        setLoading(true);

        try {
            const contextQuery = `${context}: ${userText}`; // Give AI the semantic bounds
            const res = await axios.post(`${API_URL}/ask-doubt/`, { query: contextQuery });
            
            setMsgs(prev => [...prev, { role: 'ai', text: res.data.answer, images: res.data.images || [] }]);
        } catch (error) {
            setMsgs(prev => [...prev, { role: 'ai', text: "Sorry, I am having trouble fetching the medical literature right now.", images: [] }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color={theme.text} size={28} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>AI Doubt Clearer</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.chatArea}>
                {msgs.map((msg, idx) => (
                    <View key={idx} style={[styles.messageBubble, msg.role === 'user' ? styles.userBubble : [styles.aiBubble, { backgroundColor: theme.surface }]]}>
                        <View style={styles.bubbleHeader}>
                            {msg.role === 'user' ? <User color="#fff" size={16} /> : <Brain color={theme.primary} size={16} />}
                            <Text style={[styles.roleText, { color: msg.role === 'user' ? '#fff' : theme.primary }]}>
                                {msg.role === 'user' ? 'You' : 'Medical RAG Agent'}
                            </Text>
                        </View>
                        
                        <Text style={msg.role === 'user' ? styles.userText : [styles.aiText, { color: theme.text }]}>
                            {msg.text}
                        </Text>
                        
                        {msg.images && msg.images.length > 0 && (
                            <View style={styles.imgRow}>
                                {msg.images.map((img, i) => (
                                    <Image key={i} source={{ uri: img }} style={styles.resultImage} />
                                ))}
                            </View>
                        )}
                    </View>
                ))}
                {loading && (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator color={theme.primary} />
                        <Text style={[styles.loadingTxt, { color: theme.textSecondary }]}>Consulting standard literature...</Text>
                    </View>
                )}
            </ScrollView>

            <View style={[styles.inputRow, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                    placeholder="Type your medical query..."
                    placeholderTextColor={theme.textSecondary}
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity style={[styles.sendBtn, { backgroundColor: theme.primary }]} onPress={handleSend}>
                    <ExternalLink color="#fff" size={20} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    chatArea: { padding: 16 },
    messageBubble: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        maxWidth: '90%',
    },
    userBubble: {
        backgroundColor: '#3B82F6',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
    },
    bubbleHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    roleText: { fontSize: 12, fontWeight: 'bold', marginLeft: 6 },
    userText: { color: '#fff', fontSize: 16, lineHeight: 24 },
    aiText: { fontSize: 16, lineHeight: 24 },
    imgRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
    resultImage: { width: 120, height: 120, borderRadius: 8, marginRight: 8, marginBottom: 8, backgroundColor: '#E2E8F0' },
    loadingBox: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    loadingTxt: { marginLeft: 12, fontStyle: 'italic' },
    inputRow: {
        flexDirection: 'row',
        padding: 16,
        paddingBottom: 30,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 20,
        borderWidth: 1,
        marginRight: 12,
        fontSize: 16,
    },
    sendBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
