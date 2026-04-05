import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { PlayCircle, Mic, HelpCircle, CheckCircle2, BrainCircuit } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';

const chapters = [
  { id: '1', title: 'Cell Injury and Adaptation', progress: 1.0 },
  { id: '2', title: 'Inflammation and Repair', progress: 0.45 },
  { id: '3', title: 'Hemodynamic Disorders', progress: 0.0 },
  { id: '4', title: 'Neoplasia', progress: 0.0 },
  { id: '5', title: 'Genetic Diseases', progress: 0.0 },
];

export default function ChapterDetailScreen({ route, navigation }) {
  const { bookName, filename } = route.params;
  const [difficulties, setDifficulties] = useState({});
  const { theme } = useTheme();

  const setDifficulty = (id, level) => {
    setDifficulties(prev => ({ ...prev, [id]: level }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.bookTitle, { color: theme.text }]}>{bookName}</Text>
        <Text style={[styles.author, { color: theme.textSecondary }]}>Standard Medical Textbook Series</Text>
      </View>

      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={[styles.listPadding, { flexGrow: 1 }]}
        data={chapters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const diff = difficulties[item.id] || 'easy';
          return (
          <View style={[styles.chapterCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.chapterInfo}>
              <Text style={[styles.chapterNumber, { color: theme.primary }]}>Chapter {item.id}</Text>
              <Text style={[styles.chapterTitle, { color: theme.text }]}>{item.title}</Text>
              
              <View style={styles.progressSection}>
                <View style={[styles.progressBarContainer, { backgroundColor: theme.statusBg }]}>
                  <View style={[styles.progressBarFill, { width: `${item.progress * 100}%`, backgroundColor: theme.primary }]} />
                </View>
                <Text style={[styles.progressText, { color: theme.textSecondary }]}>{Math.round(item.progress * 100)}% Completed</Text>
              </View>
            </View>

            <View style={[styles.difficultyRow, { backgroundColor: theme.iconBackground }]}>
              <TouchableOpacity 
                style={[styles.diffBtn, diff === 'easy' && [styles.diffActive, { backgroundColor: theme.surface }]]}
                onPress={() => setDifficulty(item.id, 'easy')}
              >
                <Text style={[styles.diffText, { color: theme.textSecondary }, diff === 'easy' && [styles.diffTextActive, { color: theme.primary }]]}>Easy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.diffBtn, diff === 'medium' && [styles.diffActive, { backgroundColor: theme.surface }]]}
                onPress={() => setDifficulty(item.id, 'medium')}
              >
                <Text style={[styles.diffText, { color: theme.textSecondary }, diff === 'medium' && [styles.diffTextActive, { color: theme.primary }]]}>Med</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.diffBtn, diff === 'hard' && [styles.diffActive, { backgroundColor: theme.surface }]]}
                onPress={() => setDifficulty(item.id, 'hard')}
              >
                <Text style={[styles.diffText, { color: theme.textSecondary }, diff === 'hard' && [styles.diffTextActive, { color: theme.primary }]]}>Hard</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: theme.primaryLight }]}
                onPress={() => navigation.navigate('MCQSession', { chapterTitle: item.title, bookName: filename, difficulty: diff })}
              >
                <HelpCircle color={theme.primary} size={18} />
                <Text style={[styles.actionBtnText, { color: theme.primary }]}>MCQ TEST</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionBtn, styles.vivaBtn]}
                onPress={() => navigation.navigate('VivaSession', { chapterTitle: item.title, bookName: filename, difficulty: diff })}
              >
                <Mic color="#fff" size={18} />
                <Text style={styles.actionBtnText}>VIVA VOCE</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionBtn, styles.doubtActionBtn]}
                onPress={() => navigation.navigate('Doubt', { context: `${bookName} - ${item.title}` })}
              >
                <BrainCircuit color="#fff" size={18} />
                <Text style={styles.actionBtnText}>DOUBT</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  author: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  listPadding: {
    padding: 16,
  },
  chapterCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chapterInfo: {
    marginBottom: 16,
  },
  chapterNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B82F6',
    textTransform: 'uppercase',
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 4,
  },
  progressSection: {
    marginTop: 12,
  },
  progressBarContainer: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  vivaBtn: {
    backgroundColor: '#9333EA', // Purple for Viva
  },
  doubtActionBtn: {
    backgroundColor: '#10B981', // Green for Doubt
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 10,
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 4,
  },
  diffBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  diffActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  diffText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: 'bold',
  },
  diffTextActive: {
    color: '#1E3A8A',
  }
});
