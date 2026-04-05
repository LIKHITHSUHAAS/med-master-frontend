import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { ChevronLeft, Mic, Brain, PlayCircle, CheckCircle, ActivityIndicator } from 'lucide-react-native';
import { API_URL } from '../config';
import axios from 'axios';

export default function VivaScreen({ route, navigation }) {
  const { chapterTitle } = route.params || { chapterTitle: 'Cell Injury' };
  
  const [isListening, setIsListening] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("Explain the difference between apoptosis and necrosis in terms of cell morphology.");
  const [transcription, setTranscription] = useState("");
  const [evaluation, setEvaluation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const toggleMic = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate transcription starting
      // In a real mobile app, we would use Expo Speech-to-Text here.
      // For web demo, we provide a sample medical answer.
      setTimeout(() => setTranscription("Apoptosis is programmed cell death characterized by cell shrinkage, chromatin condensation, and formation of apoptotic bodies without inflammation."), 2000);
    }
  };

  const submitAnswer = async () => {
    if (!transcription) return;
    setIsLoading(true);
    try {
        const res = await axios.post(`${API_URL}/evaluate-viva/`, {
            question: currentQuestion,
            user_answer_text: transcription
        });
        setEvaluation(res.data);
    } catch (error) {
        console.error("Viva Eval Error:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const startSession = () => {
      setSessionActive(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color="#fff" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Viva Voce Session</Text>
        <View style={{ width: 28 }} />
      </View>

      {!sessionActive ? (
          <View style={styles.idleState}>
              <View style={styles.heroCircle}>
                  <Brain color="#fff" size={80} />
              </View>
              <Text style={styles.heroTitle}>AI Medical Interviewer</Text>
              <Text style={styles.heroSubtitle}>
                  I will ask you fundamental questions about {chapterTitle}. Answer using your voice, just like a real medical board exam.
              </Text>
              
              <TouchableOpacity style={styles.startBtn} onPress={startSession}>
                  <PlayCircle color="#fff" size={24} />
                  <Text style={styles.startBtnText}>Start Interview</Text>
              </TouchableOpacity>
          </View>
      ) : (
          <ScrollView contentContainerStyle={styles.activeContent}>
                <View style={styles.interviewerChat}>
                    <View style={styles.aiAvatar}>
                        <Brain color="#fff" size={24} />
                    </View>
                    <View style={styles.aiBubble}>
                        <Text style={styles.aiText}>{currentQuestion}</Text>
                    </View>
                </View>

                {transcription ? (
                    <View style={styles.userChat}>
                        <View style={styles.userBubble}>
                            <Text style={styles.userText}>{transcription}</Text>
                        </View>
                        <Text style={styles.transcriptionLabel}>Transcribing...</Text>
                    </View>
                ) : null}

                {isListening && (
                    <View style={styles.voiceWaves}>
                        <View style={styles.wave} />
                        <View style={[styles.wave, { height: 40 }]} />
                        <View style={[styles.wave, { height: 60 }]} />
                        <View style={[styles.wave, { height: 40 }]} />
                        <View style={styles.wave} />
                    </View>
                )}
                {transcription && !evaluation ? (
                    <TouchableOpacity style={styles.submitBtn} onPress={submitAnswer} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Submit for AI Evaluation</Text>}
                    </TouchableOpacity>
                ) : null}

                {evaluation && (
                    <View style={styles.evaluationCard}>
                        <View style={styles.evalHeader}>
                            <Award color="#F59E0B" size={24} />
                            <Text style={styles.evalScore}>Score: {evaluation.score}/10</Text>
                        </View>
                        <Text style={styles.evalFeedback}>{evaluation.feedback}</Text>
                        {evaluation.key_missing_points && evaluation.key_missing_points.length > 0 && (
                            <View style={styles.missingPoints}>
                                <Text style={styles.missingTitle}>Key missing points:</Text>
                                {evaluation.key_missing_points.map((p, i) => (
                                    <Text key={i} style={styles.pointText}>• {p}</Text>
                                ))}
                            </View>
                        )}
                        <TouchableOpacity style={styles.resetBtn} onPress={() => {setEvaluation(null); setTranscription("");}}>
                            <Text style={styles.resetBtnText}>Next Question</Text>
                        </TouchableOpacity>
                    </View>
                )}
          </ScrollView>
      )}

      {sessionActive && (
          <View style={styles.footer}>
              <TouchableOpacity 
                style={[styles.micBtn, isListening && styles.micBtnActive]} 
                onPress={toggleMic}
              >
                  <Mic color="#fff" size={32} />
              </TouchableOpacity>
              <Text style={styles.micStatus}>
                  {isListening ? "Listening... Speak now" : "Tap to Answer"}
              </Text>
          </View>
      )}
    </View>
  );
}

// Re-using styles or defining new specific ones
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark professional theme for Viva
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  idleState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  heroCircle: {
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: '#1E3A8A',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
      shadowColor: '#1E3A8A',
      shadowRadius: 20,
      shadowOpacity: 0.5,
  },
  heroTitle: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 12,
  },
  heroSubtitle: {
      color: '#94A3B8',
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 40,
  },
  startBtn: {
      flexDirection: 'row',
      backgroundColor: '#1E3A8A',
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 30,
      alignItems: 'center',
  },
  startBtnText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 12,
  },
  activeContent: {
      padding: 24,
  },
  interviewerChat: {
      flexDirection: 'row',
      marginBottom: 32,
  },
  aiAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#1E3A8A',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
  },
  aiBubble: {
      flex: 1,
      backgroundColor: '#1E293B',
      padding: 20,
      borderRadius: 20,
      borderTopLeftRadius: 0,
  },
  aiText: {
      color: '#F8FAFC',
      fontSize: 18,
      lineHeight: 26,
  },
  userChat: {
      alignItems: 'flex-end',
      marginBottom: 32,
  },
  userBubble: {
      backgroundColor: '#334155',
      padding: 16,
      borderRadius: 20,
      borderTopRightRadius: 0,
      maxWidth: '85%',
  },
  userText: {
      color: '#E2E8F0',
      fontSize: 16,
      fontStyle: 'italic',
  },
  transcriptionLabel: {
      color: '#64748B',
      fontSize: 12,
      marginTop: 8,
  },
  voiceWaves: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 100,
  },
  wave: {
      width: 6,
      height: 20,
      backgroundColor: '#3B82F6',
      marginHorizontal: 4,
      borderRadius: 3,
  },
  footer: {
      position: 'absolute',
      bottom: 50,
      left: 0,
      right: 0,
      alignItems: 'center',
  },
  micBtn: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#1E3A8A',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#1E3A8A',
      shadowRadius: 15,
      shadowOpacity: 0.4,
  },
  micBtnActive: {
      backgroundColor: '#EF4444',
      transform: [{ scale: 1.1 }],
  },
  micStatus: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 16,
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  evaluationCard: {
    backgroundColor: '#1E293B',
    padding: 24,
    borderRadius: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  evalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  evalScore: {
    color: '#F59E0B',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  evalFeedback: {
    color: '#E2E8F0',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  missingPoints: {
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  missingTitle: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pointText: {
    color: '#CBD5E1',
    fontSize: 14,
    marginBottom: 4,
  },
  resetBtn: {
    backgroundColor: '#1E3A8A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
