import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';

import { API_URL } from '../config';

export default function QueryScreen({ navigation }) {
    const [content, setContent] = useState('');
    const [type, setType] = useState('request'); // 'request' or 'complaint'
    
    // In a real app, this would be grabbed from context/local storage.
    // We are mocking this for the UI for now until fully coupled.
    const username = "Current_User"; 

    const handleSubmit = async () => {
        if (!content.trim()) {
            Alert.alert("Notice", "Please enter your query.");
            return;
        }

        try {
            await axios.post(`${API_URL}/queries/raise/`, {
                username,
                content,
                type
            });
            Alert.alert("Success", "Your message has been sent directly to the Admin!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to submit query.");
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <Text style={styles.prompt}>What can we help you with?</Text>
                
                <View style={styles.toggleRow}>
                    <TouchableOpacity 
                        style={[styles.toggleBtn, type === 'request' && styles.toggleActive]}
                        onPress={() => setType('request')}
                    >
                        <Text style={type === 'request' ? styles.toggleTextActive : styles.toggleText}>Request Book</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.toggleBtn, type === 'complaint' && styles.toggleActive]}
                        onPress={() => setType('complaint')}
                    >
                        <Text style={type === 'complaint' ? styles.toggleTextActive : styles.toggleText}>Complaint</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.inputArea}
                    placeholder={type === 'request' ? "E.g., Please add Robbins Basic Pathology 10th Ed." : "Describe your issue here..."}
                    multiline
                    value={content}
                    onChangeText={setContent}
                    textAlignVertical="top"
                />

                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                    <Text style={styles.submitBtnText}>Submit to Admin</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#F8FAFC',
    },
    prompt: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 16,
    },
    toggleRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        marginHorizontal: 4,
        backgroundColor: '#fff',
    },
    toggleActive: {
        backgroundColor: '#DBEAFE',
        borderColor: '#3B82F6',
    },
    toggleText: {
        color: '#64748B',
        fontWeight: 'bold',
    },
    toggleTextActive: {
        color: '#1D4ED8',
        fontWeight: 'bold',
    },
    inputArea: {
        backgroundColor: '#fff',
        height: 200,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 24,
    },
    submitBtn: {
        backgroundColor: '#1E3A8A',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
