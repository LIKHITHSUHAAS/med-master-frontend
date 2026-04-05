import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Book, CheckCircle, Headphones, MessageCircle, BrainCircuit } from 'lucide-react-native';
import axios from 'axios';
import { useTheme } from '../theme/ThemeContext';

import { API_URL } from '../config';

const DEFAULT_BOOKS = [
  { id: '1', title: 'Pathology', icon: 'book', color: '#EF4444', progress: 0.65, filename: 'Pathology.pdf' },
  { id: '2', title: 'Anatomy', icon: 'book', color: '#10B981', progress: 0.30, filename: 'Anatomy.pdf' },
  { id: '3', title: 'Physiology', icon: 'book', color: '#3B82F6', progress: 0.15, filename: 'Physiology.pdf' },
  { id: '4', title: 'Biochemistry', icon: 'book', color: '#F59E0B', progress: 0.05, filename: 'Biochemistry.pdf' },
];

const COLORS = ['#EF4444', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const [books, setBooks] = useState(DEFAULT_BOOKS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
        const res = await axios.get(`${API_URL}/books/`);
        const serverBooks = res.data.books || [];
        
        if (serverBooks.length > 0) {
            const mappedBooks = serverBooks.map((filename, index) => {
                // Check if it's one of our defaults
                const existing = DEFAULT_BOOKS.find(b => b.filename === filename);
                if (existing) return existing;

                // Otherwise create a new card
                return {
                    id: `dynamic-${index}`,
                    title: filename.replace('.pdf', '').replace(/_/g, ' '),
                    icon: 'book',
                    color: COLORS[index % COLORS.length],
                    progress: 0,
                    filename: filename
                };
            });
            setBooks(mappedBooks);
        }
    } catch (error) {
        console.error("Error fetching books:", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={[styles.greeting, { color: '#fff' }]}>Welcome, Doctor-to-be</Text>
        <Text style={[styles.subtitle, { color: theme.primaryLight }]}>Select a subject to start your session</Text>
      </View>

      <View style={styles.grid}>
        {books.map((book) => (
          <View key={book.id} style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.text }]}>
            <TouchableOpacity 
              style={styles.cardMain}
              onPress={() => navigation.navigate('ChapterDetail', { bookName: book.title, filename: book.filename })}
            >
              <View style={[styles.iconContainer, { backgroundColor: book.color + '20' }]}>
                <Book color={book.color} size={32} />
              </View>
              <Text style={[styles.bookTitle, { color: theme.text }]}>{book.title}</Text>
              
              <View style={styles.progressRow}>
                  <View style={[styles.progressBarBg, { backgroundColor: theme.statusBg }]}>
                      <View style={[styles.progressBarFill, { width: `${book.progress * 100}%`, backgroundColor: book.color }]} />
                  </View>
                  <Text style={[styles.progressText, { color: theme.textSecondary }]}>{Math.round(book.progress * 100)}%</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.doubtBtnRow, { borderTopColor: theme.border }]}
                onPress={() => navigation.navigate('Doubt', { context: book.title })}
            >
                <BrainCircuit color={theme.primary} size={16} />
                <Text style={[styles.doubtBtnText, { color: theme.primary }]}>Ask Doubt</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.quickStats}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily Progress</Text>
        <View style={styles.statRow}>
            <View style={[styles.statItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <CheckCircle color="#10B981" size={20} />
                <Text style={[styles.statValue, { color: theme.text }]}>12/20</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>MCQs Done</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Headphones color="#3B82F6" size={20} />
                <Text style={[styles.statValue, { color: theme.text }]}>02/05</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Vivas Done</Text>
            </View>
        </View>
      </View>

      <TouchableOpacity 
          style={[styles.floatingQueryBtn, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('Query')}
      >
          <MessageCircle color="#fff" size={24} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 24,
    backgroundColor: '#1E3A8A',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#E2E8F0',
    fontSize: 14,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: (Dimensions.get('window').width / 2) - 24,
    borderRadius: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardMain: {
    padding: 16,
  },
  doubtBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    backgroundColor: '#00000008',
  },
  doubtBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginRight: 8,
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: 'bold',
  },
  quickStats: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 15,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  floatingQueryBtn: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    backgroundColor: '#3B82F6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  }
});
