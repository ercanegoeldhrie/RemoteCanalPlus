import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      <StatusBar barStyle="light-content" />
      <HomeScreen />
    </SafeAreaView>
  );
}

export default App;