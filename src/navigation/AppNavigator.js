import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ChapterDetailScreen from '../screens/ChapterDetailScreen';
import MCQScreen from '../screens/MCQScreen';
import VivaScreen from '../screens/VivaScreen';
import LoginScreen from '../screens/LoginScreen';
import AdminScreen from '../screens/AdminScreen';
import QueryScreen from '../screens/QueryScreen';
import DoubtScreen from '../screens/DoubtScreen';
import { useTheme } from '../theme/ThemeContext';
import { View, TouchableOpacity } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.surface,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 16 }}>
              {isDark ? <Sun color={theme.text} size={24} /> : <Moon color={theme.text} size={24} />}
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Med-Master AI' }}
        />
        <Stack.Screen 
          name="ChapterDetail" 
          component={ChapterDetailScreen} 
          options={({ route }) => ({ title: route.params.bookName })}
        />
        <Stack.Screen 
          name="MCQSession" 
          component={MCQScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="VivaSession" 
          component={VivaScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Admin" 
          component={AdminScreen} 
          options={{ title: 'Admin Dashboard' }}
        />
        <Stack.Screen 
          name="Query" 
          component={QueryScreen} 
          options={{ title: 'Raise a Query' }}
        />
        <Stack.Screen 
          name="Doubt" 
          component={DoubtScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
