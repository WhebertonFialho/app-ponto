import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Toast from 'react-native-toast-message'

import Navigator from '@router/Navigator';
import { initializeDatabase } from '@storage/initializeDataBase';
import { SQLiteProvider } from "expo-sqlite";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { MyDatePickerProvider } from '@contexts/MyDatePickerProvider';
import { MyLoadingProvider } from '@contexts/MyLoadingProvider';
import { MyMessageProvider } from '@contexts/MyMessageProvider';

import MyLoading from '@components/MyLoading';
import { colors } from '@theme/colors';

export default function App() {
  const [fontsLoaded] = useFonts({
    'DS-Digital': require('@assets/fonts/ds-digit.ttf'),
  });
  
  if (!fontsLoaded) 
    return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <MyDatePickerProvider>
          <MyLoadingProvider>
            <MyMessageProvider>
              <SQLiteProvider databaseName="AppPonto.db" onInit={initializeDatabase}>
                <StatusBar  />
                <Navigator />
              </SQLiteProvider>
            </MyMessageProvider>
            <MyLoading />
          </MyLoadingProvider>
        </MyDatePickerProvider>
        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}