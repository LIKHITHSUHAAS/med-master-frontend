import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { API_URL } from '../config';
import { ChevronLeft, Award, HelpCircle, XCircle, CheckCircle, ActivityIndicator, ScrollView } from 'lucide-react-native';

// Mock data for immediate preview if API is not running
const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "Which of the following is the most common cause of cell injury?",
    options: ["Hypoxia", "Physical Agents", "Chemical Agents", "Genetic Defects"],
    answer: "Hypoxia",
    explanation: "Hypoxia (oxygen deficiency) is the most common cause of cell injury and death in clinical practice."
  }
];

export default function MCQScreen({ route, navigation }) {
  const { chapterTitle, bookName, difficulty = 'easy' } = route.params || { chapterTitle: 'Inflammation', bookName: 'Pathology' };
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [chapterTitle, bookName, difficulty]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      // Use the actual filename if bookName is just a title
      const res = await axios.post(`${API_URL}/generate-mcq/${bookName}/${chapterTitle}?difficulty=${difficulty.toLowerCase()}`);
      if (res.data.questions && res.data.questions.length > 0) {
        setQuestions(res.data.questions);
      } else {
        setQuestions(MOCK_QUESTIONS);
      }
    } catch (error) {
      console.error("MCQ Load Error:", error);
      setQuestions(MOCK_QUESTIONS);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    if (selectedOption) return; // Prevent multiple selections
    setSelectedOption(option);
    setShowExplanation(true);
    if (option === questions[currentIndex].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
        // Result Screen logic could go here
        alert(`Quiz Finished! Score: ${score}/${questions.length}`);
        navigation.goBack();
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color="#1E293B" size={28} />
        </TouchableOpacity>
        <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Question {currentIndex + 1}/{questions.length}</Text>
            <View style={styles.miniProgressBar}>
                <View style={[styles.miniProgressFill, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]} />
            </View>
            <Text style={styles.diffBadgeText}>Mode: {difficulty.toUpperCase()}</Text>
        </View>
        <View style={styles.scoreBadge}>
            <Award color="#F59E0B" size={16} />
            <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {loading ? (
          <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1E3A8A" />
              <Text style={styles.loadingText}>Analyzing Textbook & Generating Questions...</Text>
          </View>
      ) : (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.questionText}>{currentQuestion?.question}</Text>

        <View style={styles.optionsContainer}>
            {currentQuestion?.options.map((option, index) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQuestion.answer;
                const showResult = showExplanation;

                let borderStyle = { borderColor: '#E2E8F0' };
                let bgStyle = { backgroundColor: '#fff' };

                if (showResult) {
                    if (isCorrect) {
                        borderStyle = { borderColor: '#10B981' };
                        bgStyle = { backgroundColor: '#D1FAE5' };
                    } else if (isSelected && !isCorrect) {
                        borderStyle = { borderColor: '#EF4444' };
                        bgStyle = { backgroundColor: '#FEE2E2' };
                    }
                } else if (isSelected) {
                    borderStyle = { borderColor: '#3B82F6' };
                    bgStyle = { backgroundColor: '#DBEAFE' };
                }

                return (
                    <TouchableOpacity 
                        key={index}
                        style={[styles.optionCard, borderStyle, bgStyle]}
                        onPress={() => handleOptionSelect(option)}
                        disabled={showExplanation}
                    >
                        <Text style={styles.optionLetter}>{String.fromCharCode(65 + index)}</Text>
                        <Text style={styles.optionText}>{option}</Text>
                        {showResult && isCorrect && <CheckCircle color="#10B981" size={20} />}
                        {showResult && isSelected && !isCorrect && <XCircle color="#EF4444" size={20} />}
                    </TouchableOpacity>
                );
            })}
        </View>

        {showExplanation && (
            <Animated.View style={styles.explanationContainer}>
                <View style={styles.explanationHeader}>
                    <HelpCircle color="#3B82F6" size={20} />
                    <Text style={styles.explanationTitle}>Detailed Explanation</Text>
                </View>
                <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
            </Animated.View>
        )}
      </ScrollView>
      )}

      <TouchableOpacity 
        style={[styles.nextBtn, !selectedOption && { backgroundColor: '#CBD5E1' }]}
        disabled={!selectedOption}
        onPress={handleNext}
      >
        <Text style={styles.nextBtnText}>
            {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  progressHeader: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  miniProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  miniProgressFill: {
    height: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  diffBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginTop: 6,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D97706',
    marginLeft: 4,
  },
  scrollContent: {
    padding: 24,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    lineHeight: 28,
    marginBottom: 32,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 15,
    borderWidth: 2,
    marginBottom: 12,
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748B',
    marginRight: 12,
    width: 24,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  explanationContainer: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    marginBottom: 100,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginLeft: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  nextBtn: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    height: 56,
    backgroundColor: '#1E3A8A',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
  },
});
