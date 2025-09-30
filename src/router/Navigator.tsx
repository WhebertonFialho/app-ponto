import React from 'react';

import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import JornadaScreen from '@screens/JornadaScreen';
import LancamentoScreen from '@screens/LancamentoScreen';
import UtilsScreen from '@screens/UtilsScreen';
import BancoHoraScreen from '@screens/BancoHoraScreen';

import { colors } from '../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CustomHeader({ title }: { title: string }) {
  return (
    <SafeAreaView style={{ backgroundColor: 'transparent' }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

const Tabs = () => {
  return(
      <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarActiveTintColor: '#46cce7', 
            tabBarInactiveTintColor: colors.grayColor,  
            tabBarStyle: {
              backgroundColor: colors.backgroundColorDark,       
              borderTopColor: colors.backgroundColorLigth,          
              height: 80,                       
            },
            header: () => <CustomHeader title={route.name} />, 
            headerTitleAlign: 'center',
            headerTintColor: colors.textColor,
          })
        }
      >
        <Tab.Screen 
          name="Lançamento" 
          component={ LancamentoScreen }
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="clock-circle" size={size} color={color} style={{ marginTop: 3 }}/>
            ),
          }} 
        />
        <Tab.Screen 
          name="Jornada" 
          component={ JornadaScreen } 
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="switcher" size={size} color={color} style={{ marginTop: 3 }}/>
            ),
          }} 
        />
        <Tab.Screen 
          name="Utils" 
          component={ UtilsScreen } 
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="ellipsis" size={size} color={color} style={{ marginTop: 3 }}/>
            ),
          }} 
        />
      </Tab.Navigator>
  )
}

export default function Navigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{
            headerStyle: { backgroundColor: colors.backgroundColorDark },
            headerTintColor: colors.textColor,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >      
          <Stack.Screen
            name="Tabs"
            component={ Tabs }
            options={{ headerShown: false }}
          />

          <Stack.Screen name="Banco Horas" component={ BancoHoraScreen } />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.backgroundColorLigth,
    backgroundColor: colors.backgroundColorDark,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.textColor,
    fontWeight: 'bold',
    fontSize: 18,
  },
});